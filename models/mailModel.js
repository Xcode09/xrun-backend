const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('smpts', {
        host: {
            type: DataTypes.STRING,
            required: true
        },
        port: {
            type: DataTypes.STRING,
            trim: true,
            required: true
        },
        mail_username: {
            type: DataTypes.STRING,
            required: true
        },
        mail_password: {
            type: DataTypes.STRING,
            required: true
        },
        encryption: {
            type: DataTypes.STRING,
            required: true
        },
        senderEmail: {
            type: DataTypes.STRING,
            required: true
        }

    },
        {
            timestamps: true
        },
    );
};