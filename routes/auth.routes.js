const router = require('express').Router();
const upload = require('../middleware/upload');
const { registerPlayer, registerCoach, login } = require('../controllers/auth.controller');

router.post('/register/player', upload.single('picture'), registerPlayer);
router.post('/register/coach',  upload.single('picture'), registerCoach);
router.post('/login', login);

module.exports = router;
