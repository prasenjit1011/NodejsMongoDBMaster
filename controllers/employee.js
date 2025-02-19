const mysqldb   = require('../util/docker_mysql_database');
const Employee      = require('../models/employee'); // Docker Sequelize use in model


exports.getEmployeeList = (req, res, next) => {
    const query = 'SELECT * FROM myemployees';
    mysqldb.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching data:', err.stack);
        res.status(500).send('Error fetching data');
        return;
      }
      res.json(['-: Data using MySql2 :-', results]);
    });
}


exports.getmployeeData = async (req, res, next) => {

    const empData = await Employee.findAll({raw:true});

    return res.json(['-: Data using Sequelize :-', empData]);
}
