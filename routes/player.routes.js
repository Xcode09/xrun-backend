const router = require('express').Router();
const userController = require('../controllers/player.controller');
const { authenticate } = require('../middleware/auth');


router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.editProfile);
router.put('/change-password', authenticate, userController.changePassword);
router.delete('/delete-account', authenticate, userController.deleteAccount);

module.exports = router;
