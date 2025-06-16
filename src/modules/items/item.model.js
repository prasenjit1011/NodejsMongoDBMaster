// const items = [];
// module.exports = items;


const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    price:    { type: Number, required: true, min: 0 },
    images:   [String],                       // S3 URLs
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
