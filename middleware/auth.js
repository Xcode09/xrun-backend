const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

// const user = await User.findByPk(decoded.id, {
//   include: {
//     model: Role,
//     as: 'Role', // must match the 'as' you declared
//   }
// });

// req.user = user;

exports.authenticate = async (req, res, next) => {
  const hdr = req.headers.authorization;
  if (!hdr) return res.status(401).json({ error: 'No token' });
  const token = hdr.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(payload.sub, { include: Role });
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.roleId)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};