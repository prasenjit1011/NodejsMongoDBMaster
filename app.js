const express = require('express');
const Sequelize = require('sequelize');
const app = express();
const port = 3080;

// Create a Sequelize instance to connect to MySQL
const sequelize = new Sequelize({
  host: 'mysql_db',
  dialect: 'mysql',
  port: 3305,
  username: 'root',
  password: 'lnsel',
  database: 'mydb'
});

// // Test the MySQL connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Basic route to check if the server is running
app.get('/', (req, res) => {
  res.send('Hello World! 123');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:3080`);
});
