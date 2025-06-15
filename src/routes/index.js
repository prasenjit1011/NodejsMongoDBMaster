const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to Lambda Home Page! 2156...');
});
  
router.get('/dummy', (req, res) => {
    res.send('Dummy page from Lambda.... 2156');
});

router.get('/about', (req, res) => {
    res.send('My About New page from Lambda ... 2156');
});

module.exports = router;
