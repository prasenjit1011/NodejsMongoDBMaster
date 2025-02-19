const express   = require('express');
const mysql     = require('mysql2');
require('dotenv').config();

const app = express();
const port = 3000;

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
  console.log('Connected to MySQL as id ' + db.threadId);
});

// Fetch data from the `myemployee` table
app.get('/employees', (req, res) => {
  const query = 'SELECT * FROM myemployee';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err.stack);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});

app.get('/', (req, res) => {
    return res.json([
                parseInt(100*Math.random()),
                parseInt(100*Math.random()),
                parseInt(100*Math.random()),
                parseInt(100*Math.random()),
                parseInt(100*Math.random())
            ]);
});

console.log('-: Docker Started :-');
// Start the server
app.listen(port, () => {
  console.log(`Node.js app is listening on http://localhost:${port}`);
});
