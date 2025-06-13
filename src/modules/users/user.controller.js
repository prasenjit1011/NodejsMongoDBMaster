const userModel = require('./user.model');
      
function create(req, res) {
  const user = userModel.createUser(req.body);
  res.status(201).json(user);
}

function get(req, res) {
  const user = userModel.getUser(Number(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}

function update(req, res) {
  const user = userModel.updateUser(Number(req.params.id), req.body);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}

function remove(req, res) {
  const deleted = userModel.deleteUser(Number(req.params.id));
  if (!deleted) return res.status(404).json({ message: 'User not found' });
  res.status(204).end();
}

function list(req, res) {
  res.json(userModel.getAllUsers());
}

module.exports = { create, get, update, remove, list };
      