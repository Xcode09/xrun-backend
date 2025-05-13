const { Match, Ground } = require('../models');
const { Op } = require('sequelize');

exports.createMatch = async (req, res, next) => {
  try {
    const { title, startTime, endTime, matchType, positions, groundName, coordinates } = req.body;

    const user = req.user;
    // Save ground first
    const ground = await Ground.create({
      name: groundName,
      coordinates // Array of 4 coordinate points [{lat, lng}, ...]
    });

    // Save match
    const match = await Match.create({
      title,
      startTime,
      endTime,
      matchType,
      positions,
      groundId: ground.id,
      createdBy: user.id
    });

    res.status(201).json({ message: 'Match and ground saved successfully', data: match });
  } catch (err) {
    next(err);
  }
};


exports.getMatchesByDate = async (req, res, next) => {
    try {
      const { date } = req.query; // Expected format: 'YYYY-MM-DD'
      if (!date) {
        return res.status(400).json({ error: 'Date is required in query params' });
      }
      const user = req.user;
      const matches = await Match.findAll({
        where: {
        createdBy: user.id,
          startTime: {
            [Op.gte]: new Date(`${date}T00:00:00Z`),
            [Op.lt]: new Date(`${date}T23:59:59Z`)
          }
        },
        include: [Ground]
      });
  
      res.status(200).json({status: 0, message: 'All Matches', data: matches });
    } catch (err) {
      next(err);
    }
  };