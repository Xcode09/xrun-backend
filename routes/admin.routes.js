const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { listCoaches, approveCoach, listPlayers } = require('../controllers/admin.controller');
router.use(authenticate, authorize('superuser'));
router.get('/coaches', listCoaches);
router.put('/coaches/:coachId/approve', approveCoach);
router.get('/players', listPlayers);
const { approvePlayer, rejectPlayer, rejectCoach, getCoachById, getPlayerById, getAllUsers } = require('../controllers/admin.controller');
router.put('/players/:playerId/approve', approvePlayer);
router.put('/players/:playerId/reject', rejectPlayer);
router.put('/coaches/:coachId/reject', rejectCoach);
router.get('/coaches/:coachId', getCoachById);
router.get('/players/:playerId', getPlayerById);
router.get('/users', getAllUsers);





module.exports = router;