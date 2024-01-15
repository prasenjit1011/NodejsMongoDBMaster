
exports.employeeList = (req, res, next) => {
    var data = [{id:45, name:'Sam'}, {id:75, name:"tony"}];
    return res.json(data);
}