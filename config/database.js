const { Sequelize } = require('sequelize');
const { database } = require('./config');
const logger = require('./logger');

const sequelize = new Sequelize(
  database.name,
  database.user,
  database.password,
  {
    host: database.host,
    dialect: database.dialect,
    port: database.port,
    logging: (msg) => logger.info(msg),
  }
);

sequelize.authenticate()
  .then(() => logger.info('Database connection established'))
  .catch((err) => logger.error('Database connection failed:', err));

module.exports = sequelize;
