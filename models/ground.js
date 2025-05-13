const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Ground', {
      name: { type: DataTypes.STRING, allowNull: false },
      coordinates: { type: DataTypes.JSONB, allowNull: false }, // [{lat, lng}, ...]
    });
  };
  