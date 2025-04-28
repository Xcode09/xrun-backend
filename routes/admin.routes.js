const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { listCoaches, approveCoach, listPlayers } = require('../controllers/admin.controller');

router.use(authenticate, authorize('superuser'));
router.get('/coaches', listCoaches);
router.put('/coaches/:coachId/approve', approveCoach);
router.get('/players', listPlayers);

module.exports = router;