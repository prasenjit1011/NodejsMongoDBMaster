const express   = require('express');
const router    = express.Router();
const { Client }= require('@elastic/elasticsearch');

const client = new Client({
                        node: 'https://my-elasticsearch-project-e8744c.es.us-east-1.aws.elastic.cloud:443',
                        auth: {apiKey: 'OWluZ2taY0JHUXFGSFN2MjdZTkM6ZzNHSU9uLTdXN01ScVR0Q1RtMVpKQQ=='},
                        serverless: true
                    });

const INDEX = 'students';
router.get('/add', async (req, res) => {
    try {
        const data  = {title:"Rani = 01A ", details:"Loren ipsum dummy data. Loren ipsum dummy data. Loren ipsum dummy data. Loren ipsum dummy data. Loren ipsum dummy data. Loren ipsum dummy data. Loren ipsum dummy data."};
        const result= await client.index({index: INDEX, document: data});
        res.json({ message: 'Student created', id: result._id });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all students
router.get('/', async (req, res) => {
    try {
        await client.indices.create({ index: 'students' }, { ignore: [400] });
        const result    = await client.search({index: INDEX, query: { match_all: {} }});
        const students  = result.hits.hits.map(hit => ({
                                                        id: hit._id,
                                                        ...hit._source
                                                    }));
        res.json(students);
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get student by ID
router.get('/:id', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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

module.exports = router;