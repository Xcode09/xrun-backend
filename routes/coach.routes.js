const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { listPlayers, requestAddPlayer, removePlayer } = require('../controllers/coach.controller');

router.use(authenticate, authorize(2));
router.get('/players', listPlayers);
router.post('/players/request', requestAddPlayer);
router.delete('/players/:playerId', removePlayer);

router.get('/coach/player/:playerId/matches', authenticate, authorize(2), getPlayerMatches);
router.get('/coach/player/:playerId/metrics', authenticate, authorize(2), getPlayerMetrics);
router.get('/coach/player/:playerId/performance', authenticate, authorize(2), getPlayerPerformance);


module.exports = router;