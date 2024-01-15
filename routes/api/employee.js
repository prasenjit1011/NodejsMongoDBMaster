const express   = require('express');
const router    = express.Router();

const employee  = require('../../controllers/employee');
router.get('/employee/list', employee.employeeList);

module.exports = router;