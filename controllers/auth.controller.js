const { Role, User, OTP } = require('../models');
const {
  hashPassword,
  comparePassword,
  generateJwt,
  generateUniquePlayerId,
  generateUniqueCoachId
} = require('../utils/auth');
const { Op } = require('sequelize');
const otpGenerator = require("otp-generator");
const sendOtpMail = require("../services/sendOtpMail");

const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.registerPlayer = async (req, res, next) => {
  try {
    const role = await Role.findOne({ where: { name: 'Player' } });
    const pwd = await hashPassword(req.body.password);
    const playerUuid = await generateUniquePlayerId(req.body);
    const pic = req.file ? `/uploads/${req.file.filename}` : null;


    const user = await User.create({
      ...req.body,
      passwordHash: pwd,
      playerUuid,
      pictureUrl: pic,
      roleId: role.id
    });

    const otp_n = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

    const email = req.body.email;

    // save OTP
    const [record, created] = await OTP.findOrCreate({
      where: { email },
      defaults: { otp: otp_n } // ✅ use 'otp', not 'otp_n'
    });

    if (!created) {
      await OTP.update({ otp: otp_n }, { where: { email } }); // ✅ correct field name
    }

    // Send OTP email
    try {

      await sendOtpMail(otp_n, req.body.email, req.body.firstName);

    } catch (emailError) {
      return res.json({ data: { success: 0, message: "Something went wrong. Please try again...", error: 1 } });
    }

    res.status(201).json({ status: 0, message: "Player register Successfully", data: {} });

    //return res.status(201).json({ id: role });

  } catch (err) { next(err); }
}

exports.registerCoach = async (req, res, next) => {
  try {
    const role = await Role.findOne({ where: { name: 'coach' } });
    const pwd = await hashPassword(req.body.password);
    const coachUuid = await generateUniqueCoachId();
    const pic = req.file ? `/uploads/${req.file.filename}` : null;
    const user = await User.create({
      clubName: req.body.clubName,
      country: req.body.country,
      mobile: req.body.mobile,
      email: req.body.email,
      passwordHash: pwd,
      coachUuid,
      pictureUrl: pic,
      roleId: role.id
    });


    res.status(201).json({ message: 'Coach pending approval' });
  } catch (err) { next(err); }
}

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email }, include: Role });
    if (!user || !(await comparePassword(req.body.password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid creds' });
    }
    //return res.json({ user });

    // if (user.roleId===2 && !user.isApproved) {
    //   return res.status(403).json({ error:'Coach not approved' });
    // }
    const token = generateJwt(user);
    res.json({ token });
  } catch (err) { next(err); }
}

// Google & Apple Signup/Login
exports.socialAuth = async (req, res, next) => {
  try {
    const { firstName, email, googleId, appleToken } = req.body;
    let user = null; // Define user variable at the beginning
    const role = await Role.findOne({ where: { name: 'Player' } });

    //return res.json({ email, user });
    // Apple Sign-In Handling
    if (appleToken) {
      try {
        const jwtClaims = await verifyAppleToken({
          idToken: appleToken,
          clientId: 'com.sahkrsolution.ticketit',
        });

        let appleEmail = jwtClaims.email; // Private relay email (only on first login)
        let appleSub = jwtClaims.sub; // Unique Apple user ID

        // Check if user exists by Apple ID
        user = await User.findOne({ appleId: appleSub });

        // If user does not exist, check by email (only on first-time login)
        if (!user && appleEmail) {
          user = await User.findOne({ email: appleEmail });

          // If user exists, update their Apple ID for future logins
          if (user) {
            user.appleId = appleSub;
            await user.save();
          }
        }

        // If user still does not exist, create a new one
        if (!user) {

          user = await User.create({
            ...req.body,
            appleId: appleSub,
            playerUuid: appleSub,
            roleId: role.id
          });


          await user.save();
        }
      } catch (error) {
        console.log("Apple Token Verification Error:", error.message);
        return res.status(400).json({ data: { success: 0, message: error.message, error: 2 } });
      }
    }

    // Google Sign-In or Manual Email Check
    if (!user && googleId && email) {
      user = await User.findOne({
        where: {
          [Op.and]: [
            { email },
            { googleId }
          ]
        }
      });

      if (!user) {
        // double check: make sure no user exists with this email and a null googleId
        const existingByEmail = await User.findOne({ where: { email } });

        if (existingByEmail) {
          return res.status(400).json({
            data: {
              success: 0,
              message: 'A user with this email already exists but has no matching Google ID.',
              error: 4
            }
          });
        }

        // Create new user
        user = await User.create({
          firstName,
          email,
          googleId,
          playerUuid: googleId,
          roleId: role.id
        });

        await user.save();
      }
    }

    // Generate JWT token
    const token = generateJwt(user);

    //res.json({ user });
    res.json({ token });

  } catch (error) {
    console.log("Error in social login:", error.message);
    return res.status(500).json({ data: { success: 0, message: error.message, error: 3 } });
  }
};

exports.forgotpassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  // // User not found
  // if (!user) {
  //   return res.status(404).json({ data: { success: 0, message: `No user with this email ${email}`, error: 1 } });
  // }

  // Check if user signed up only with Google or Apple
  const isSocialOnly = !user.password && (user.googleId || user.appleId);
  if (isSocialOnly) {
    return res.status(404).json({ data: { success: 0, message: 'This account was created using a social login. Please log in with Google or Apple.', error: 1 } });

  }

  // Proceed with generating reset token
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600000); // 1 hour

  await user.update({
    resetToken: token,
    resetTokenExpires: expires,
  });

  const resetLink = `https://xrun.genetum.com/api/auth/reset-password/${token}`;
  
  //`http://localhost:3000/api/auth/reset-password/${token}`;

 

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "alisaleem877@gmail.com",
      pass: "fhqe bbgn qnvu dtyz"
    }
  });

  await transporter.sendMail({
    to: user.email,
    subject: 'Password Reset Request',
    html: `<p>You requested a password reset</p>
           <p><a href="${resetLink}">Click here to reset your password</a></p>`,
  });

  return res.json({ status: 0, message: "Password reset email sent." });
};


exports.otpverification = async (req, res) => {

  try {

    const { email, otp_n } = req.body;

    // Validate email and otp
    if (!email || !otp_n) {
      return res.json({ data: { success: 0, message: "Email and OTP is required", error: 1 } });
    }

    // Check if there is an OTP record for the given email
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.json({ data: { success: 0, message: "Incorrect Email. Please try again...", error: 1 } });
    }

    // Check if the provided OTP matches the stored OTP
    if (otp_n !== otpRecord.otp) {
      return res.json({ data: { success: 0, message: "Incorrect OTP. Please try again...", error: 1 } });
    }

    // Update the OTP verification status
    otpRecord.isVerified = true;
    await otpRecord.save();

    return res.json({ data: { success: 1, message: "OTP verified successfully", error: 0 } });

  } catch (error) {
    console.log("Error during forgot password otp verification", error.message);
    return res.json({ data: { success: 0, message: "An error occurred", error: 1 } });
  }
};

// GET /auth/reset-password/:token


exports.resetLinkPassword = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    where: {
      resetToken: token,
      resetTokenExpires: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    return res.render('reset-password', { error: 'Token is invalid or expired' });
  }

  res.render('reset-password', { token });
};



exports.resetPassowrdWithToken = async (req, res) => {

  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    where: {
      resetToken: token,
      resetTokenExpires: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    return res.json({ data: { success: 1, message: "Token is invalid or expired", error: 0 } });

  }

  const hashedPassword = await hashPassword(password);

  await user.update({
    password: hashedPassword,
    resetToken: null,
    resetTokenExpires: null,
  });

  return res.json({ data: { success: 1, message: "Password has been reset successfully. You can now log in.", error: 0 } });

};
