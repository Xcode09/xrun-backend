const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Role = require('./role')(sequelize);
const User = require('./user')(sequelize);
const CoachPlayer = require('./coachPlayer')(sequelize);
const MetricSample = require('./metricSample')(sequelize);
const Match = require('./match')(sequelize);
const Ground = require('./ground')(sequelize);
const smpts = require('./mailModel')(sequelize);
const OTP = require('./forgotPassowrdOtpModel')(sequelize);

// Associations
Role.hasMany(User);
User.belongsTo(Role);

User.belongsToMany(User, {
  as: 'Players',
  through: CoachPlayer,
  foreignKey: 'coachId',
  otherKey: 'playerId'
});
User.belongsToMany(User, {
  as: 'Coaches',
  through: CoachPlayer,
  foreignKey: 'playerId',
  otherKey: 'coachId'
});

User.hasMany(MetricSample, { foreignKey: 'playerId' });
MetricSample.belongsTo(User, { foreignKey: 'playerId' });

// In your index.js or association setup file

// Associations
User.hasMany(Match, { foreignKey: 'createdBy', as: 'createdMatches' });
Match.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

Ground.hasMany(Match, { foreignKey: 'groundId' });
Match.belongsTo(Ground, { foreignKey: 'groundId' });

Match.hasMany(MetricSample, { foreignKey: 'matchId', as: 'metrics' });
MetricSample.belongsTo(Match, { foreignKey: 'matchId', as: 'match' });


module.exports = { sequelize, Role, User, CoachPlayer, MetricSample, Match ,Ground, smpts, OTP};
