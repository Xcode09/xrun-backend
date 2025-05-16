// Importing required modules 
const nodemailer = require("nodemailer");
const path = require("path");
const hbs = require('nodemailer-express-handlebars').default;


// Importing models
// const mailModel = require("../models");

// Function to send OTP verification email
const sendOtpMail = async (otp, email, name) => {
    try {
        // Fetch Mail details
        //const SMTP = await mailModel.findOne();

        // if (!SMTP) {
        //     throw new Error("Mail details not found");
        // }

        // Mail transporter configuration
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

        // Dynamically import nodemailer-express-handlebars
       
        // Path for mail templates
        //const templatesPath = path.resolve(__dirname, "../views/");

        // Handlebars setup for nodemailer
        // Setup Handlebars engine
        const handlebarOptions = {
            viewEngine: {
                extname: '.handlebars',
                partialsDir: path.resolve(__dirname, '../views/mail-templates'),
                layoutsDir: path.resolve(__dirname, '../views/mail-templates'),
                defaultLayout: false,
            },
            viewPath: path.resolve(__dirname, '../views/mail-templates'),
            extName: '.handlebars',
        };

        transporter.use('compile', hbs(handlebarOptions));

        // // Validate input parameters
        // if (!otp || !email) {
        //     throw new Error("Invalid input parameters");
        // }

        const mailOptions = {
            from: email,
            template: "otp",
            to: email,
            subject: 'OTP Verification',
            context: {
                OTP: otp,
                email: email,
                name: name
            }
        };

        // Sending the email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error("Failed to send mail:", error);
            } else {
                console.log("Email sent:", info.response);
            }
        });

    } catch (error) {
        console.error("Error sending OTP mail:", error.message);
        throw error;
    }
};

module.exports = sendOtpMail;