const express   = require('express');
const router    = express.Router();
const userCtrl  = require('../modules/users/user.controller');

router.post('/', userCtrl.create);
router.get('/:id', userCtrl.get);
router.put('/:id', userCtrl.update);
router.delete('/:id', userCtrl.remove);
router.get('/', userCtrl.list);

module.exports = router;
