const express   = require('express');
const router    = express.Router();

const multer        = require('multer');
const fileStorage   = multer.diskStorage({
                                destination: 'images',
                                filename: (req, file, cb) => { cb(null, parseInt(100*Math.random())+'-'+file.originalname); }
                            });
const fileFilter = (req, file, cb) => {
                                        if ( file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' ) { cb(null, true); } 
                                        else { cb(null, false); }
                                    };
const upload = multer({ storage: fileStorage, fileFilter: fileFilter });





const hotelCtrl = require('../controllers/hotelController');

router.get('/api/hotels/:hotelId/review/:reviewId', hotelCtrl.getHotelReviewDetails);
router.get('/api/hotels/:hotelId/review', hotelCtrl.getHotelReview);

router.get('/api/hotels/list/:id?', hotelCtrl.getHotelList);
router.get('/api/hotels/details/:id', hotelCtrl.getHotelDetails);

router.post('/api/hotels/book', hotelCtrl.bookNow);
router.get('/api/hotels/booking/list', hotelCtrl.bookingList);

router.post('/api/contactus', upload.single('image'), hotelCtrl.contactUs);

module.exports = router;