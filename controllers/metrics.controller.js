const { MetricSample } = require('../models');

exports.postSample = async (req,res,next) => {
  try {
    const sample = await MetricSample.create({
      playerId: req.user.id,
      ...req.body
    });
    res.status(201).json(sample);
  } catch(err){ next(err); }
};