const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const app = express();
app.use(express.json());

// Elasticsearch client
//const client = new Client({ node: 'http://localhost:9200' });
const client = new Client({
    node: 'https://my-elasticsearch-project-e8744c.es.us-east-1.aws.elastic.cloud:443',
    auth: {
      apiKey: 'OWluZ2taY0JHUXFGSFN2MjdZTkM6ZzNHSU9uLTdXN01ScVR0Q1RtMVpKQQ=='  // Replace with actual key
    },
    serverless: true
  });

// Index name
const INDEX = 'students';

// Create student
app.post('/students', async (req, res) => {
  try {
    const result = await client.index({
      index: INDEX,
      document: req.body
    });
    res.json({ message: 'Student created', id: result._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all students
app.get('/students', async (req, res) => {
  try {
    const result = await client.search({
      index: INDEX,
      query: { match_all: {} }
    });
    const students = result.hits.hits.map(hit => ({
      id: hit._id,
      ...hit._source
    }));
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get student by ID
app.get('/students/:id', async (req, res) => {
  try {
    const result = await client.get({
      index: INDEX,
      id: req.params.id
    });
    res.json(result._source);
  } catch (err) {
    res.status(404).json({ error: 'Student not found' });
  }
});

// Update student by ID
app.put('/students/:id', async (req, res) => {
  try {
    const result = await client.update({
      index: INDEX,
      id: req.params.id,
      doc: req.body
    });
    res.json({ message: 'Student updated', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete student by ID
app.delete('/students/:id', async (req, res) => {
  try {
    await client.delete({
      index: INDEX,
      id: req.params.id
    });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(404).json({ error: 'Student not found' });
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
