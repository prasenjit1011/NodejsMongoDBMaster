const asyncHandler  = require('express-async-handler');
const mongoose = require('mongoose');
const Item          = require('./item.model');
const { uploadBuffer } = require('../../utils/s3Uploader');

// POST /items
exports.createItem = asyncHandler(async (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    res.status(400);
    throw new Error('Name & price are required');
  }

  let vendorId;
  if (req.vendor?.id) {
    if (mongoose.Types.ObjectId.isValid(req.vendor.id)) {
      vendorId = new mongoose.Types.ObjectId(req.vendor.id);
    } else {
      return res.status(400).json({ message: 'Invalid vendor ID format' });
    }
  }


  // 1. Upload images concurrently
  //const images = req.files?.map(file => file.path) || [];
  const images =
    req.files?.length
      ? await Promise.all(
          req.files.map(f => uploadBuffer(f.buffer, f.originalname, f.mimetype))
        )
      : [];



  // 2. Persist item to MongoDB
  const item = await Item.create({
    name,
    price,
    images,
    vendorId
  });

  res.status(201).json(item);
});

// GET /items
exports.getAllItems = asyncHandler(async (_req, res) => {
  const items = await Item.find().sort({ createdAt: -1 });
  res.json(items);
});
