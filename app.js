const express = require('express');
const app = express();
const { hello } = require('./handlers');

console.clear();
console.log('\n\n-: App Started :-');

// JSON middleware
app.use(express.json());

// Route for /test
app.use('/test', (req, res) => {
  res.json(['test']);
});

// Route to wrap Lambda handler
app.use('/hello', async (req, res, next) => {
    try {
      // Construct a fake AWS Lambda event
      const event = {
        body: req.body,
        queryStringParameters: req.query,
        headers: req.headers,
        httpMethod: req.method,
        path: req.path,
      };
  
      const result = await hello(event);
  
      res.status(result.statusCode || 200).json(JSON.parse(result.body));
    } catch (err) {
      next(err);
    }
  });


// Route to wrap Lambda handler
app.use('/test', async (req, res, next) => {
    try {
      // Simulated Lambda response object
      const result = {
        statusCode: 200,
        body: JSON.stringify({
          a: "hello",
          b: "dummy"
        })
      };
  
      // Return the parsed response
      res.status(result.statusCode).json(JSON.parse(result.body));
    } catch (err) {
      next(err);
    }
  });
  


 

// Default route
app.use('/', (req, res) => {
  console.log('-: Welcome :-');
  res.send('-: Welcome :-');
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Central Error Handler:', err.message);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

console.log('-: App Running :-');
app.listen(3000);
