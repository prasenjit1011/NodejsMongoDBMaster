const Event     = require('events');
const eventData = new Event();

const users = {};
function createUser(name) {
  const id      = Date.now();
  const user    = { id, name };
  users[id]  = user;

  // Emit user-created event
  eventData.emit('userCreated', users);

  return users;
}

function userList(){
  return users;
}


module.exports = { createUser, userList };
