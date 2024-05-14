const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const stockSchema = new Schema({
  sid:{
    type: String,
    required: true
  },
  stock:{
    type: String,
    required: false
  },
  share_name: {
    type: String,
    required: false
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
    required: false
  },
  sid_grow:{
    type: String,
    required: false
  },
  nseCode:{
    type: String,
    required: false
  },
  stock:{
    type: String,
    required: false
  }
});

module.exports = mongoose.model('demat', stockSchema);