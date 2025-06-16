const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
  name: String,
  email: String,
  images: [String], // S3 URLs
});
// , {
//   timestamps: true
// }

module.exports = mongoose.model('Manager', managerSchema);
