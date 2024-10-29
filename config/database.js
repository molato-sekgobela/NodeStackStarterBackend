const { Sequelize } = require ('sequelize')
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,{
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: true,
    }
);

sequelize.authenticate()
.then(() =>{
    console.log('connection established');
})
.catch((err) =>{
    console.error('Connection failed');
});

module.exports = sequelize;