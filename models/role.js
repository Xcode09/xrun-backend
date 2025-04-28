const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Role', {
    name: { type: DataTypes.STRING, unique: true, allowNull: false, default: 'Player'}
  }, { tableName: 'Roles', timestamps: false });
};