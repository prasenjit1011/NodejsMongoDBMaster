const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const vendors = require('../modules/vendors/vendors');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const vendor = vendors.find(v => v.username === username);

  if (!vendor || !bcrypt.compareSync(password, vendor.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: vendor.id, username: vendor.username }, 'secret123', { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
