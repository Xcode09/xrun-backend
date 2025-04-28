const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { listPlayers, requestAddPlayer, removePlayer } = require('../controllers/coach.controller');

router.use(authenticate, authorize('coach'));
router.get('/players', listPlayers);
router.post('/players/request', requestAddPlayer);
router.delete('/players/:playerId', removePlayer);

module.exports = router;