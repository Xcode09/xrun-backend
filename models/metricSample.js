const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('MetricSample', {
    timestamp: { type: DataTypes.DATE, allowNull: false },
    speed: DataTypes.FLOAT,
    heartRate: DataTypes.INTEGER,
    spo2: DataTypes.FLOAT,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    altitute: DataTypes.FLOAT,
    half: {
    type: DataTypes.ENUM('FIRST_HALF', 'SECOND_HALF'),
    allowNull: false
  }
  });
};