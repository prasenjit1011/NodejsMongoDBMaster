// app.js
const express = require('express');
const cors = require('cors');
const { hello } = require('./handlers');

const app = express();
app.use(express.json());
app.use(cors());

console.clear();
console.log('\n\n-: App Started :-');

app.get('/test', (req, res) => {
  res.json(['test']);
});

app.post('/hello', async (req, res, next) => {
  try {
    const event = {
      body: JSON.stringify(req.body),
      queryStringParameters: req.query,
      headers: req.headers,
      httpMethod: req.method,
      path: req.originalUrl,
    };

    const result = await hello(event);
    res.status(result.statusCode || 200).json(JSON.parse(result.body));
  } catch (err) {
    next(err);
  }
});

app.get('/dummy', (req, res) => {
  res.status(200).json({ a: 'hello', b: 'dummy' });
});

app.get('/', (req, res) => {
  console.log('-: Welcome :-');
  res.send('-: Welcome :-');
});

app.use((err, req, res, next) => {
  console.error('Central Error Handler:', err.message);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(3000, () => console.log('-: App Running at http://localhost:3000 :-'));
