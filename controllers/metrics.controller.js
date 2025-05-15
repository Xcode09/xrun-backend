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

exports.getMetrics = async (req,res,next) => {
  try {
    const metrics = await MetricSample.findAll({
      where: { playerId: req.user.id },
    });
    res.status(200).json({ message: 'Metrics of player', data: metrics });
  } catch(err){ next(err); }
};