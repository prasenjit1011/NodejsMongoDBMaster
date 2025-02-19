const express   = require('express');
require('dotenv').config();

const app = express();
const port = 3000;

const employee = require('./routes/employee');
app.use("/employee", employee);


app.get('/', (req, res) => {
    return res.json([
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
