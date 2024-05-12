const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const stockSchema = new Schema({
  sid:{
    type: String,
    required: true
  },
  stock:{
    type: String,
    required: true
  },
  share_name: {
    type: String,
    required: true
  },
  ltp: {
    type: Number,
    required: false
  },
  cost: {
    type: Number,
    required: false
  },
  qty: {
    type: Number,
    required: false
  },
  sold_qty: {
    type: Number,
    required: true
  },
  sid_grow:{
    type: String,
    required: true
  },
  stock:{
    type: String,
    required: false
  }
});

module.exports = mongoose.model('demat', stockSchema);