const { Role, User } = require('../models');
const {
  hashPassword,
  comparePassword,
  generateJwt,
  generateUniquePlayerId,
  generateUniqueCoachId
} = require('../utils/auth');

exports.registerPlayer = async (req,res,next) => {
  try {
    const role = await Role.findOne({ where:{ name:'Player' }});
    const pwd = await hashPassword(req.body.password);
    const playerUuid = await generateUniquePlayerId(req.body);
    const pic = ""; //req.file?`/uploads/${req.file.filename}`:null;

    
    const user = await User.create({
      ...req.body,
      passwordHash: pwd,
      playerUuid,
      pictureUrl: pic,
      roleId:role.id
    });
    
    res.status(201).json({status: 0, message: "Player register Successfully", data: user });

   //return res.status(201).json({ id: role });

  } catch(err) { next(err); }
};

exports.registerCoach = async (req,res,next) => {
  try {
    const role = await Role.findOne({ where:{ name:'coach' }});
    const pwd = await hashPassword(req.body.password);
    const coachUuid = await generateUniqueCoachId();
    const pic = req.file?`/uploads/${req.file.filename}`:null;
    const user = await User.create({
      clubName:req.body.clubName,
      country:req.body.country,
      mobile:req.body.mobile,
      email:req.body.email,
      passwordHash:pwd,
      coachUuid,
      pictureUrl:pic,
      roleId:role.id
    });
    res.status(201).json({ message:'Coach pending approval' });
  } catch(err){ next(err); }
};

exports.login = async (req,res,next) => {
  try {
    const user = await User.findOne({ where:{ email:req.body.email }, include: Role });
    if (!user || !(await comparePassword(req.body.password,user.passwordHash))) {
      return res.status(401).json({ error:'Invalid creds' });
    }
    //return res.json({ user });

    if (user.roleId===2 && !user.isApproved) {
      return res.status(403).json({ error:'Coach not approved' });
    }
    const token = generateJwt(user);
    res.json({ token });
  } catch(err){ next(err); }
};