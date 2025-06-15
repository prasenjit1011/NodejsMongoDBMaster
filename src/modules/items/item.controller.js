const asyncHandler  = require('express-async-handler');
const Item          = require('./item.model');
const { uploadBuffer } = require('../../utils/s3Uploader');

// POST /items
exports.createItem = asyncHandler(async (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    res.status(400);
    throw new Error('Name & price are required');
  }

  // 1. Upload images concurrently
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
    vendorId: req.vendor?.id,      // comes from your auth middleware
  });

  res.status(201).json(item);
});

// GET /items
exports.getAllItems = asyncHandler(async (_req, res) => {
  const items = await Item.find().sort({ createdAt: -1 });
  res.json(items);
});
