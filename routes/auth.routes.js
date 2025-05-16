const router = require('express').Router();
const upload = require('../middleware/upload');
const { registerPlayer, registerCoach, login, socialAuth, forgotpassword} = require('../controllers/auth.controller');
const { smtps } = require('../models/mailModel');
router.post('/register/player', upload.single('picture'), registerPlayer);
router.post('/register/coach',  upload.single('picture'), registerCoach);
router.post('/login', login);



router.post('/socail-login', socialAuth);


router.post('/forgotPassword',forgotpassword);



router.post('/smtps',async function addSmtp(req, res) {
    
    try {
        const {
            host,
            port,
            mail_username,
            mail_password,
            encryption,
            senderEmail
        } = req.body;

        // Simple validation
        if (!host || !port || !mail_username || !mail_password || !encryption || !senderEmail) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const newSmtp = await smtps.create({
            host,
            port,
            mail_username,
            mail_password,
            encryption,
            senderEmail
        });

        return res.status(201).json({ message: 'SMTP settings saved successfully.', data: newSmtp });
    } catch (error) {
        console.error('Error creating SMTP:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }

});

module.exports = router;
