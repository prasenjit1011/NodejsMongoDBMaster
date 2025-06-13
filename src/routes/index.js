const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to Lambda Home Page! 0822...');
});
  
router.get('/dummy', (req, res) => {
    res.send('Dummy page from Lambda.... 0815');
});

router.get('/about', (req, res) => {
    res.send('My About New page from Lambda ... 0819');
});



const controller = require('../modules/products/productController');

router.get('/products', controller.getAll);
router.get('/products/:id', controller.getById);
router.post('/products/', controller.create);
router.put('/products/:id', controller.update);
router.delete('/products/:id', controller.remove);



module.exports = router;
