const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to Lambda Home Page!');
});
  
router.get('/dummy', (req, res) => {
    res.send('Dummy page from Lambda');
});

router.get('/about', (req, res) => {
    res.send('My About New page from Lambda');
});

module.exports = router;
