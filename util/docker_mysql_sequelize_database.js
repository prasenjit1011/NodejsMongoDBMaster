const Sequelize = require('sequelize');

const sequelize = new Sequelize('mydb01', 'root', 'lnsel', {
  dialect: 'mysql',
  host: 'mysql'
});



// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('\n\n Sequelize Connection has been established successfully.');
  })
  .catch(err => {
    console.error('\n\n Unable to connect to the database:', err);
  });

module.exports = sequelize;
