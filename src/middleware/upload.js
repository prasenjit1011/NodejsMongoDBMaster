const multer = require('multer');
const path   = require('path');

const allowed = /jpeg|jpg|png/i;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ok = allowed.test(path.extname(file.originalname)) && allowed.test(file.mimetype);
  cb(ok ? null : new Error('Only jpeg, jpg, png allowed'), ok);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },   // 5 MB/file
});
