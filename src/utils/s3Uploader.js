// utils/s3Uploader.js
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const BUCKET = process.env.BUCKET_NAME || 'mylambda-bucket-images';

async function uploadToS3(file) {
  const key = `uploads/${Date.now()}-${file.originalname}`;
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read', // ← IMPORTANT!
  });

  await s3.send(command);

  return `https://${BUCKET}.s3.amazonaws.com/${key}`;
}

module.exports = { uploadToS3 };
