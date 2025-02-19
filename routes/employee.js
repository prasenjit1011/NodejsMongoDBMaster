
const express   = require('express');
const router    = express.Router();

const employeeCtrl = require('../controllers/employee');
router.get('/list', employeeCtrl.getEmployeeList);
router.get('/data', employeeCtrl.getmployeeData);

module.exports  = router;