// routes/item.js
const express = require('express');
const auth    = require('../middleware/auth');
const upload  = require('../middleware/upload');
const itemCtrl = require('../modules/items/item.controller');
const router  = express.Router();


router.get('/', itemCtrl.getAllItems);
router.post('/', auth, upload.array('images', 5), itemCtrl.createItem);

module.exports = router;