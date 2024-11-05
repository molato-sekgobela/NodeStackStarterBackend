const { Sequelize } = require('sequelize');
const { database } = require('./config');
const logger = require('./logger');
const fs = require('fs');
const path = require('path');

const sslCert = fs.readFileSync(path.resolve(__dirname, 'us-east-1-bundle.pem'));

const sequelize = new Sequelize(
  database.name,
  database.user,
  database.password,
  {
    host: database.host,
    dialect: database.dialect,
    port: database.port,
    logging: (msg) => logger.info(msg),
    dialectOptions: {
      ssl: {
        require: true,
        ca: sslCert, // This enables the use of the RDS SSL certificate
      },
    },
  }
);

sequelize.authenticate()
  .then(() => logger.info('Database connection established'))
  .catch((err) => logger.error('Database connection failed:', err));

module.exports = sequelize;
