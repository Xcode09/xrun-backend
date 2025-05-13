const router = require('express').Router();
const userController = require('../controllers/player.controller');
const { authenticate } = require('../middleware/auth');
const matchController = require('../controllers/matchController');

router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.editProfile);
router.put('/change-password', authenticate, userController.changePassword);
router.delete('/delete-account', authenticate, userController.deleteAccount);


router.post('/match', authenticate, matchController.createMatch);
router.get('/matches/by-date',authenticate, matchController.getMatchesByDate);



module.exports = router;
