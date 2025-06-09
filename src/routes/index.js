const express = require('express');
const router = express.Router();


router.get('/about', (req, res) => {
    res.send('About page from Lambda');
});

router.get('/dummy', (req, res) => {
    res.send('Dummy page from Lambda');
});

router.get('/', (req, res) => {
    res.send('Welcome to Lambda Home Page!');
});
  

module.exports = router;
