// config/db.js
const { Sequelize } = require('sequelize');

// Use environment variables for flexibility
const sequelize = new Sequelize(
  process.env.DB_NAME || 'abidcomputers',
  process.env.DB_USER || 'abidcomputers',
  process.env.DB_PASSWORD || null, // Fix here
  {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false
  }
);

module.exports = sequelize;
