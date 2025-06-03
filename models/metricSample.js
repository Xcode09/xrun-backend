const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('MetricSample', {
    playerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    matchId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    groundId: {
      type: DataTypes.INTEGER,
      allowNull: true // or false depending on your logic
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true
    },
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