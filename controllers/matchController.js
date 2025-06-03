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

exports.getMatchById = async (req, res, next) => {
  try {
    const { matchId } = req.params;
    const match = await Match.findByPk(matchId, {
      include: [Ground]
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.status(200).json({ status: 0, message: 'Match details', data: match });
  } catch (err) {
    next(err);
  }
}

exports.getAllMatches = async (req, res, next) => {
  try {
    const matches = await Match.findAll({
      include: [Ground]
    });

    res.status(200).json({ status: 0, message: 'All Matches', data: matches });
  } catch (err) {
    next(err);
  }
};

exports.getAllGrounds = async (req, res, next) => {
  try {
    const grounds = await Ground.findAll();
    res.status(200).json({ status: 0, message: 'All Grounds', data: grounds });
  } catch (err) {
    next(err);
  }
};

exports.updateMatch = async (req, res, next) => {
  try {
    const { matchId } = req.params;
    const { title, startTime, endTime, matchType, positions, groundName, coordinates } = req.body;

    const match = await Match.findByPk(matchId);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Update ground if groundName or coordinates are provided
    if (groundName || coordinates) {
      const ground = await Ground.findByPk(match.groundId);
      if (ground) {
        await ground.update({ name: groundName, coordinates });
      }
    }

    // Update match details
    await match.update({
      title,
      startTime,
      endTime,
      matchType,
      positions
    });

    res.status(200).json({ message: 'Match updated successfully', data: match });
  } catch (err) {
    next(err);
  }
};
exports.deleteMatch = async (req, res, next) => {
  try {
    const { matchId } = req.params;
    const match = await Match.findByPk(matchId);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    await match.destroy();
    res.status(200).json({ message: 'Match deleted successfully' });
  } catch (err) {
    next(err);
  }
};
exports.getMatchesByGround = async (req, res, next) => {
  try {
    const { groundId } = req.params;
    const matches = await Match.findAll({
      where: { groundId },
      include: [Ground]
    });

    if (!matches.length) {
      return res.status(404).json({ error: 'No matches found for this ground' });
    }

    res.status(200).json({ status: 0, message: 'Matches for the ground', data: matches });
  } catch (err) {
    next(err);
  }
};
exports.getMatchesByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const matches = await Match.findAll({
      where: { createdBy: userId },
      include: [Ground]
    });

    if (!matches.length) {
      return res.status(404).json({ error: 'No matches found for this user' });
    }

    res.status(200).json({ status: 0, message: 'User matches', data: matches });
  } catch (err) {
    next(err);
  }
};