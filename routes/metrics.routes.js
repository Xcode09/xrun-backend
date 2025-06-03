const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { postSample, getMetrics } = require('../controllers/metrics.controller');
const upload = require('../middleware/upload');
router.post('/', authenticate, authorize(1) ,upload.single('picture'), postSample);


router.get('/', authenticate, authorize(1), getMetrics);

module.exports = router;