const Sequelize = require('sequelize');

const dbconnect = new Sequelize('test', 'root', '', {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306
});

module.exports = dbconnect;