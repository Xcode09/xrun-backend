const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Role = require('./role')(sequelize);
const User = require('./user')(sequelize);
const CoachPlayer = require('./coachPlayer')(sequelize);
const MetricSample = require('./metricSample')(sequelize);

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

module.exports = { sequelize, Role, User, CoachPlayer, MetricSample };
