const express = require('express');
const multer = require('multer');
const { uploadBuffer } = require('../utils/s3Uploader');
const Manager = require('../modules/manager/manager.model');//./manager.model');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.array('images', 5), async (req, res) => {
  const { name, email } = req.body;
  const imageUrls = await Promise.all(
    req.files.map(file => uploadBuffer(file.buffer, file.mimetype))
  );
  const manager = new Manager({ name, email, images: imageUrls });
  await manager.save();
  res.json(manager);
});

router.get('/list', async (req, res)=>{
    const managers = await Manager.find();
    res.json(managers);
})

module.exports = router;
