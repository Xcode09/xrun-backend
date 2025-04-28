const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('MetricSample', {
    timestamp: { type: DataTypes.DATE, allowNull: false },
    speedKmh: DataTypes.FLOAT,
    heartRate: DataTypes.INTEGER,
    spo2: DataTypes.FLOAT,
    xCoord: DataTypes.FLOAT,
    yCoord: DataTypes.FLOAT
  });
};