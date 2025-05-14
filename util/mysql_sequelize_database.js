const Sequelize = require('sequelize');

const dbconnect = new Sequelize('test', 'root', 'password', {
  dialect: 'mysql',
  host: 'localhost',
  port: 3632
});

// dbconnect.options.logging = false
// Authenticate the connection
const connectToDatabase = async () => {
  try {
    await dbconnect.authenticate(); // Test the connection
    console.log('Connection to MySQL has been established');
  } catch (err) {
    console.error('Unable to connect to the database:', err.message);
  } finally {
    //await dbconnect.close(); // Close the connection
  }
};

connectToDatabase();
module.exports = dbconnect;
