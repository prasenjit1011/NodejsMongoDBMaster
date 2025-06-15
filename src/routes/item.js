// routes/item.js
const express = require('express');
const auth    = require('../middleware/auth');
const upload  = require('../middleware/upload');
const items   = require('../modules/items/items');
const router  = express.Router();

router.get('/', (req, res) => {
  res.status(200).json(items);
});

// ✅ Multiple image upload route
router.post('/', auth, upload.array('images', 5), (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) return res.status(400).json({ message: 'Name and price required' });

  const imagePaths = req.files?.map(file => file.path) || [];
  
  const newItem = {
    id: items.length + 1,
    name,
    price,
    images: imagePaths,
    vendorId: req.vendor.id,
  };

  items.push(newItem);
  res.status(201).json(newItem);
});

module.exports = router;
