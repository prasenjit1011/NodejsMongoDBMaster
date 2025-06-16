const bcrypt = require('bcryptjs');

const vendors = [
  {
    id: 1,
    username: 'vendor1',
    password: bcrypt.hashSync('secret123', 10),
  },
];

module.exports = vendors;
