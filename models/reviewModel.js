const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Product'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
});

module.exports = mongoose.model('Review', reviewSchema);