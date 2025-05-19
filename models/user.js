const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    clubName: DataTypes.STRING,
    dateOfBirth: DataTypes.DATEONLY,
    gender: DataTypes.STRING,
    country: DataTypes.STRING,
    mobile: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    passwordHash: {
      type: DataTypes.STRING,
      required: function () {
        return !this.googleId && !this.appleId;  // Required only if no social login
      }
    },
    pictureUrl: DataTypes.TEXT,
    playerUuid: { type: DataTypes.STRING, unique: true },
    coachUuid: { type: DataTypes.STRING, unique: true },
    googleId: { type: DataTypes.STRING, default: null },
    appleId: { type: DataTypes.STRING, default: null },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    isApproved: { type: DataTypes.BOOLEAN, defaultValue: true },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles', // Must match table name
        key: 'id'
      }
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
};
