const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  age: Number
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
