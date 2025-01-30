const Sequelize = require('sequelize');

const dbconnect = new Sequelize('test', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});



module.exports = dbconnect;
