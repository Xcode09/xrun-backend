const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { postSample, getMetrics } = require('../controllers/metrics.controller');
router.post('/', authenticate, authorize(1), postSample);


router.get('/', authenticate, authorize(1), getMetrics);

module.exports = router;