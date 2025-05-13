const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Match', {
        title: DataTypes.STRING,
        startTime: DataTypes.DATE,
        endTime: DataTypes.DATE,
        matchType: DataTypes.STRING,
        position: DataTypes.STRING,
        groundId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
        }
      });
  };
  