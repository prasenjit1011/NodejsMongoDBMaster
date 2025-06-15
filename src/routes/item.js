const express = require('express');
const auth = require('../middleware/auth');
const items = require('../modules/items/items');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(201).json(items);
});

router.post('/', auth, (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) return res.status(400).json({ message: 'Name and price required' });
  

  const newItem = { id: items.length + 1, name, price, vendorId: req.vendor.id };
  items.push(newItem);
  res.status(201).json(newItem);
});

module.exports = router;
