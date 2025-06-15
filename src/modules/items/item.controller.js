// modules/items/item.controller.js
const items = require('./items');
const { uploadToS3 } = require('../../utils/s3Uploader');

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const crypto = require('crypto');

const s3 = new S3Client({ region: 'us-east-1' }); // or process.env.AWS_REGION

async function createItem(req, res) {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price required' });
    }

    const uploadedImages = [];

    if (req.files && req.files.length) {
      for (const file of req.files) {
        const ext = path.extname(file.originalname);
        const key = `uploads/${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;

        const uploadParams = {
          Bucket: process.env.BUCKET_NAME, // e.g., 'mylambda-bucket-images'
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        await s3.send(new PutObjectCommand(uploadParams));
        uploadedImages.push(`https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`);
      }
    }

    const newItem = {
      id: Date.now(), // Simplified for demo
      name,
      price,
      images: uploadedImages,
      vendorId: req.vendor?.id || null,
    };

    items.push(newItem);
    res.status(201).json(newItem);
  } catch (err) {
    console.error('S3 Upload Error:', err);
    res.status(500).json({ message: 'File upload failed', error: err.message });
  }
}


function getAllItem(req, res) {
  res.status(200).json(items);
}

module.exports = { createItem, getAllItem };

















// const items   = require('./items');

// const AWS = require('aws-sdk');
// const multer = require('multer');

// // Initialize S3
// const s3 = new AWS.S3();
// const BUCKET_NAME = process.env.BUCKET_NAME || 'mylambda-bucket-images';

// // Configure multer to use memory storage
// const storage = multer.memoryStorage();
// const upload = multer({ storage });



// // 🟡 Upload a single file to S3
// async function uploadFileToS3(file) {
//   const params = {
//     Bucket: BUCKET_NAME,
//     Key: `uploads/${Date.now()}-${file.originalname}`,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   };

//   const result = await s3.upload(params).promise();
//   return result.Location; // Public URL of the uploaded file
// }

// // ✅ Multiple image upload route
// async function createItem(req, res) {
//   try {
//     const { name, price } = req.body;
//     const uploadPromises = req.files?.map(file => uploadFileToS3(file)) || [];

//     const imageUrls = await Promise.all(uploadPromises);

//     const newItem = {
//       id: items.length + 1,
//       name,
//       price,
//       images: imageUrls,
//       vendorId: req.vendor.id,
//     };

//     items.push(newItem);
//     res.status(201).json(newItem);
//   } catch (err) {
//     console.error('Upload error:', err);
//     res.status(500).json({ error: 'Failed to upload files to S3' });
//   }
// }

// function getAllItem(req, res){
//   res.status(200).json(items);
// };




// module.exports = {
//   getAllItem,
//   createItem,
//   upload, // Export multer middleware to use in routes
// };





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
