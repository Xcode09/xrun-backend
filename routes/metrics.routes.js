const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { postSample } = require('../controllers/metrics.controller');

router.post('/', authenticate, authorize('player'), postSample);




module.exports = router;