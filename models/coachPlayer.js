const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('CoachPlayer', {
    requestedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    acceptedAt: DataTypes.DATE
  });
};