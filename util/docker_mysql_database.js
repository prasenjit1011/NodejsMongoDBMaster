
const mysql     = require('mysql2');

// MySQL connection setup
const db = mysql.createConnection({
    host: 'mysql',  // This should match the MySQL service name from docker-compose.yml
    user: 'root',
    password: 'lnsel',
    database: 'mydb01'
  });
  
// // Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('\n\n Connected to MySQL as id ' + db.threadId);
});
  

module.exports = db;


