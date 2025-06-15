const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const itemRoutes = require('./item');
const userRoutes = require('./users');
const productRoutes = require('./products');

router.use('/auth', authRoutes);
router.use('/items', itemRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);

router.get('/', (req, res) => {
    res.send('Welcome to Lambda Home Page! 0822...');
});
  
router.get('/dummy', (req, res) => {
    res.send('Dummy page from Lambda.... 0815');
});

router.get('/about', (req, res) => {
    res.send('My About New page from Lambda ... 0819');
});




const ctrl = require('../modules/customers/customer.controller');

router.get('/customers', ctrl.getAll);
router.get('/customers/:id', ctrl.getById);
router.post('/customers/', ctrl.create);
router.put('/customers/:id', ctrl.update);
router.delete('/customers/:id', ctrl.remove);



module.exports = router;
