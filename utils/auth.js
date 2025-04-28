const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.hashPassword = (plain) => bcrypt.hash(plain, 12);
exports.comparePassword = (plain, hash) => bcrypt.compare(plain, hash);

exports.generateJwt = (user) => jwt.sign(
  { sub: user.id, role: user.roleId },
  process.env.JWT_SECRET,
  { expiresIn: '12h' }
);

// UUID generators
function makeId(fn, ln, yr, g) {
  const rnd = Math.floor(Math.random() * 10);
  return `${fn}${ln}${yr}${g}${rnd}`;
}

exports.generateUniquePlayerId = async ({ firstName, lastName, dateOfBirth, gender }) => {
  const fn = firstName.slice(0,2).toUpperCase();
  const ln = lastName.slice(0,2).toUpperCase();
  const yr = new Date(dateOfBirth).getFullYear() % 100;
  const gd = gender.charAt(0).toUpperCase();
  let id, exists;
  do {
    id = makeId(fn,ln,yr,gd);
    exists = await User.findOne({ where: { playerUuid: id } });
  } while (exists);
  return id;
};

exports.generateUniqueCoachId = async () => {
  const yr = new Date().getFullYear() % 100;
  let id, exists;
  do {
    const rnd = Math.floor(Math.random()*10000);
    id = `C${yr}${rnd}`;
    exists = await User.findOne({ where: { coachUuid: id } });
  } while (exists);
  return id;
};
