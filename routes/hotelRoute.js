const express   = require('express');
const router    = express.Router();
const multer = require('multer')
const upload = multer({ dest: 'images/' })

const hotelCtrl = require('../controllers/hotelController');

router.get('/api/hotels/:hotelId/review/:reviewId', hotelCtrl.getHotelReviewDetails);
router.get('/api/hotels/:hotelId/review', hotelCtrl.getHotelReview);

router.get('/api/hotels/list/:id?', hotelCtrl.getHotelList);
router.get('/api/hotels/details/:id', hotelCtrl.getHotelDetails);

router.post('/api/hotels/book', hotelCtrl.bookNow);
router.get('/api/hotels/booking/list', hotelCtrl.bookingList);

router.post('/api/contactus', upload.single('image'), hotelCtrl.contactUs);

module.exports = router;