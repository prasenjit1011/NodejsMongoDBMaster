const Sequelize = require('sequelize');
const dbconnect = require('../util/docker_mysql_sequelize_database');

const Employee = dbconnect.define('myemployees', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: Sequelize.STRING
});

module.exports = Employee;