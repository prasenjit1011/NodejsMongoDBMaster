const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const itemRoutes = require('./item');
const userRoutes = require('./users');
const productRoutes     = require('./products');
const customerRoutes   = require('./customers');

router.use('/auth', authRoutes);
router.use('/items', itemRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/customers', customerRoutes);

router.get('/', (req, res) => {
    res.send('Welcome to Lambda Home Page! S3 1630...');
});
  
router.get('/dummy', (req, res) => {
    res.send('Dummy page from Lambda.... S3 1754');
});

router.get('/about', (req, res) => {
    res.send('My About New page from Lambda ... S3 929');
});






module.exports = router;
