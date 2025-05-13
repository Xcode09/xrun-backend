const { User, CoachPlayer } = require('../models');
const { Match, Ground } = require('../models');
const { MetricSample } = require('../models');

exports.listPlayers = async (req,res,next) => {
  try {
    const players = await req.user.getPlayers();
    res.json({status: 0, message: "Players List", data: players});
  } catch(err){ next(err); }
};

exports.requestAddPlayer = async (req,res,next) => {
  try {
    const player = await User.findOne({ where:{ playerUuid:req.body.playerUuid }});
    if(!player) return res.status(404).json({ error:'Player not found' });
    await CoachPlayer.create({ coachId:req.user.id, playerId:player.id });
    res.json({ status: 0, message:'Request sent' });
  } catch(err){ next(err); }
};

exports.removePlayer = async (req,res,next) => {
  try {
    await CoachPlayer.destroy({
      where:{ coachId:req.user.id, playerId:req.params.playerId }
    });
    res.json({ status: 0,message:'Removed' });
  } catch(err){ next(err); }
};

exports.getPlayerMatches = async (req, res, next) => {
  try {
    const { playerId } = req.params;

    const matches = await Match.findAll({
      where: { createdBy: playerId },
      include: [Ground],
    });

    res.json({ status: 0, message: '',data: matches });
  } catch (err) {
    next(err);
  }
};


exports.getPlayerMetrics = async (req, res, next) => {
  try {
    const { playerId } = req.params;

    const metrics = await MetricSample.findAll({
      where: { playerId },
    });

    res.json({ status: 0, data: metrics });
  } catch (err) {
    next(err);
  }
};