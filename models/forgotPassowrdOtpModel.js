const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('OTP', {
        email: {
            type: DataTypes.STRING,
            allowNull: false, // Correct way to mark field as required
        },
        otp: {
            type: DataTypes.INTEGER, // Use INTEGER instead of NUMBER
            allowNull: false,
        },
        isVerified: {
            type: DataTypes.BOOLEAN, // Use BOOLEAN for true/false fields
            defaultValue: false,
        }
    }, {
        timestamps: true, // Adds createdAt and updatedAt
    });
};
