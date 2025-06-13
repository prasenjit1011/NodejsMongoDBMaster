let users = [];
let id = 1;

function createUser(data) {
  const user = { id: id++, ...data };
  users.push(user);
  return user;
}

function getUser(id) {
  return users.find(user => user.id === id);
}

function updateUser(id, data) {
  const user = getUser(id);
  if (!user) return null;
  Object.assign(user, data);
  return user;
}

function deleteUser(id) {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return false;
  users.splice(index, 1);
  return true;
}

function getAllUsers() {
  return users;
}

function resetUsers() {
  users = [];
  id = 1;
}

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
  resetUsers
};
   