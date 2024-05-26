const express   = require('express');
const router    = express.Router();

const mailCtrl = require('../controllers/mailController');
router.post('/sendMail', mailCtrl.sendMail);


module.exports = router;
