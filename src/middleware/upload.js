const multer = require('multer');
const path   = require('path');

const allowed = /jpeg|jpg|png/i;

// // Storage config
const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });


const fileFilter = (req, file, cb) => {
  const ok = allowed.test(path.extname(file.originalname)) && allowed.test(file.mimetype);
  cb(ok ? null : new Error('Only jpeg, jpg, png allowed'), ok);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },   // 5 MB/file
});
