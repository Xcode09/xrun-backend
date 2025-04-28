const { User, CoachPlayer } = require('../models');

exports.listPlayers = async (req,res,next) => {
  try {
    const players = await req.user.getPlayers();
    res.json(players);
  } catch(err){ next(err); }
};

exports.requestAddPlayer = async (req,res,next) => {
  try {
    const player = await User.findOne({ where:{ playerUuid:req.body.playerUuid }});
    if(!player) return res.status(404).json({ error:'Player not found' });
    await CoachPlayer.create({ coachId:req.user.id, playerId:player.id });
    res.json({ message:'Request sent' });
  } catch(err){ next(err); }
};

exports.removePlayer = async (req,res,next) => {
  try {
    await CoachPlayer.destroy({
      where:{ coachId:req.user.id, playerId:req.params.playerId }
    });
    res.json({ message:'Removed' });
  } catch(err){ next(err); }
};