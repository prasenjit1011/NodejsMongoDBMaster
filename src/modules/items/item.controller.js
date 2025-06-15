const items   = require('./items');


function getAllItem(req, res){
  res.status(200).json(items);
};

// ✅ Multiple image upload route
function createItem(req, res){
  console.log('===============================================')
  console.log(req.body);
  console.log('============================')
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
};

module.exports = { createItem, getAllItem };
