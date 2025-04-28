const { User } = require('../models');

exports.listCoaches = async (req,res,next) => {
  try { const coaches = await User.findAll({ where:{ roleId:2 }}); res.json(coaches); }
  catch(err){ next(err); }
};

exports.approveCoach = async (req,res,next) => {
  try {
    const coach = await User.findByPk(req.params.coachId);
    coach.isApproved = true;
    await coach.save();
    res.json({ message:'Coach approved' });
  } catch(err){ next(err); }
};

exports.listPlayers = async (req,res,next) => {
  try { const players = await User.findAll({ where:{ roleId:1 }}); res.json(players); }
  catch(err){ next(err); }
};