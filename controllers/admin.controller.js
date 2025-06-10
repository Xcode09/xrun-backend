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

exports.approvePlayer = async (req,res,next) => {
  try {
    const player = await User.findByPk(req.params.playerId);
    player.isApproved = true;
    await player.save();
    res.json({ message:'Player approved' });
  } catch(err){ next(err); }
}
exports.rejectPlayer = async (req,res,next) => {
  try {
    const player = await User.findByPk(req.params.playerId);
    player.isApproved = false;
    await player.save();
    res.json({ message:'Player rejected' });
  } catch(err){ next(err); }
};

exports.rejectCoach = async (req,res,next) => {
  try {
    const coach = await User.findByPk(req.params.coachId);
    coach.isApproved = false;
    await coach.save();
    res.json({ message:'Coach rejected' });
  } catch(err){ next(err); }
};

exports.getCoachById = async (req,res,next) => {
  try {
    const coach = await User.findByPk(req.params.coachId);
    if (!coach) return res.status(404).json({ message:'Coach not found' });
    res.json(coach);
  } catch(err){ next(err); }
};

exports.getPlayerById = async (req,res,next) => {
  try {
    const player = await User.findByPk(req.params.playerId);
    if (!player) return res.status(404).json({ message:'Player not found' });
    res.json(player);
  } catch(err){ next(err); }
};

exports.getAllUsers = async (req,res,next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch(err){ next(err); }
};



// The above code is a Node.js controller for managing coaches and players in an admin panel. 

// This code is a Node.js controller for managing coaches and players in an admin panel.
// It provides functions to list coaches and players, approve or reject them, and handle errors.
// The functions interact with a User model to perform database operations.
// The code uses async/await for asynchronous operations and handles errors with try/catch blocks.
//       }                                                                                      