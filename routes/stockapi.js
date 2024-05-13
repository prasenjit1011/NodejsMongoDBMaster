const express   = require('express');
const router    = express.Router();

const stockCtrl = require('../controllers/stockCtrl');
router.get('/stock/list', stockCtrl.getStockList);
router.get('/networth', stockCtrl.getNetworth);
router.get('/stock/details/:sid', stockCtrl.getShareDetails);
router.get('/update/stock/details', stockCtrl.updateStockData);
router.post('/uploadFile', stockCtrl.tradeBook);
router.get('/tradedata', stockCtrl.getTradeData);
router.post('/updStockParam', stockCtrl.updStockParam);

module.exports  = router;