const { MetricSample, User, Match, Ground } = require('../models');

exports.postSample = async (req,res,next) => {
  
  try {
    const pic = req.file ? `/uploads/${req.file.filename}` : null;
    const sample = await MetricSample.create({
      playerId: req.user.id,
      matchId: req.body.matchId,
      groundId: req.body.groundId,
      timestamp: new Date(),
      speed: req.body.speed,
      heartRate: req.body.heartRate,
      spo2: req.body.spo2,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      altitute: req.body.altitute,
      half: req.body.half, // Assuming 'half' is part of the request body
      picture: pic,
    });
    res.status(201).json(sample);
  } catch(err){ next(err); }
};

exports.getMetrics = async (req, res, next) => {
  try {
    const playerData = await User.findByPk(req.user.id, {
      include: [
  {
    model: Match,
    as: 'createdMatches', // use same alias
    include: [
      {
        model: MetricSample,
        as: 'metrics',
        where: { playerId: req.user.id },
        required: false,
      },
    ],
  },
],
    });

    if (!playerData) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.status(200).json({
      message: 'Player match metrics',
      data: playerData,
    });
  } catch (err) {
    next(err);
  }
};

