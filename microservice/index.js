const express   = require('express');
const Event     = require('events');
const eventData = new Event();

const { createUser, userList } = require('./userService');

const app = express();
app.use(express.json());

// Listen to custom event
eventData.on('userCreated', (user) => {
  console.log('✅ New user created:', user);
});

// Route
app.post('/users', (req, res) => {
    const { name }    = req.body;
    const user        = createUser(name);
    eventData.emit('userCreated', user);
  
    res.status(201).json(user);
  });
app.get('/users', (req, res) => {
    const userData    = userList();
    res.status(201).json(userData);
});

const PORT = 3700;
app.listen(PORT, () => {
  console.clear();
  console.log(`User Service running on port : ${PORT}`);
});
