const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const path   = require('path');

const s3 = new S3Client({ region: process.env.AWS_REGION });

/**
 * Upload a buffer → S3, return the public URL.
 */
exports.uploadBuffer = async (buffer, originalName, mime) => {
  const ext = path.extname(originalName).toLowerCase();
  const key = `uploads/${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key:    key,
      Body:   buffer,
      ContentType: mime,
    })
  );

  return `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};
