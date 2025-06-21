const express         = require('express');
const { v4: uuidv4 }  = require('uuid');

const router          = express.Router();
const dynamodb        = require('../dynamodb');
const TABLE_NAME      = 'Products';

// List all products
router.get('/list', async (req, res) => {
  try {
    const data = await dynamodb.scan({ TableName: TABLE_NAME }).promise();
    res.json(data.Items);
  } catch (err) {
    console.log('Err : ',err);
    res.status(500).json({ err, error: 'Failed to fetch products' });
  }
});

// Create new product
router.get('/add', async (req, res) => {
  //const { name, price, description } = req.body;
  const { name, price, description } = {name:"Test 003", price:885544, description:"dummy 007752"};
  const newProduct = {
    id: uuidv4(),
    name,
    price,
    description
  };

  try {
    await dynamodb.put({
      TableName: TABLE_NAME,
      Item: newProduct
    }).promise();

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(201).json({err:"error"});
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const data = await dynamodb.get({
      TableName: TABLE_NAME,
      Key: { id: req.params.id }
    }).promise();

    if (!data.Item) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(data.Item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Update product by ID
router.put('/:id', async (req, res) => {
  const { name, price, description } = req.body;

  const params = {
    TableName: TABLE_NAME,
    Key: { id: req.params.id },
    UpdateExpression: 'set #name = :n, price = :p, description = :d',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':n': name,
      ':p': price,
      ':d': description
    },
    ReturnValues: 'ALL_NEW'
  };

  try {
    const data = await dynamodb.update(params).promise();
    res.json(data.Attributes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product by ID
router.delete('/:id', async (req, res) => {
  try {
    await dynamodb.delete({
      TableName: TABLE_NAME,
      Key: { id: req.params.id }
    }).promise();

    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;