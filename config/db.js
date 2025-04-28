// config/db.js
const { Sequelize } = require('sequelize');

// Use environment variables for flexibility
const sequelize = new Sequelize(
  process.env.DB_NAME || 'abidcomputers',
  process.env.DB_USER || 'abidcomputers',
  null, // no password
  {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
    logging: false
  }
);

module.exports = sequelize;
