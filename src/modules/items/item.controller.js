const items   = require('./items');

const AWS = require('aws-sdk');
const multer = require('multer');

// Initialize S3
const s3 = new AWS.S3();
const BUCKET_NAME = process.env.BUCKET_NAME || 'mylambda-bucket-images';

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });



// 🟡 Upload a single file to S3
async function uploadFileToS3(file) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `uploads/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const result = await s3.upload(params).promise();
  return result.Location; // Public URL of the uploaded file
}

// ✅ Multiple image upload route
async function createItem(req, res) {
  try {
    const { name, price } = req.body;
    const uploadPromises = req.files?.map(file => uploadFileToS3(file)) || [];

    const imageUrls = await Promise.all(uploadPromises);

    const newItem = {
      id: items.length + 1,
      name,
      price,
      images: imageUrls,
      vendorId: req.vendor.id,
    };

    items.push(newItem);
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload files to S3' });
  }
}

function getAllItem(req, res){
  res.status(200).json(items);
};




module.exports = {
  getAllItem,
  createItem,
  upload, // Export multer middleware to use in routes
};





// ✅ Multiple image upload route
// function createItem(req, res){
//   console.log('===============================================')
//   console.log(req.body);
//   console.log('============================')
//   const { name, price } = req.body;
//   if (!name || !price) return res.status(400).json({ message: 'Name and price required' });

//   const imagePaths = req.files?.map(file => file.path) || [];
  
//   const newItem = {
//     id: items.length + 1,
//     name,
//     price,
//     images: imagePaths,
//     vendorId: req.vendor.id,
//   };

//   items.push(newItem);
//   res.status(201).json(newItem);
// };

// module.exports = { createItem, getAllItem };
