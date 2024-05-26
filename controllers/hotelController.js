const HotelModel    = require('../models/hotelModel');
const Booking = require('../models/bookingModel');

exports.getHotelList = (req, res, next)=>{

    return HotelModel
                .find()
                .then(data=>{                    

                    return res.end(JSON.stringify(data));
                })
                .catch();

}


exports.getHotelDetails = (req, res, next)=>{

    return HotelModel
                .findById(req.params.id)
                .then(data=>{

                    return res.end(JSON.stringify(data));
                })
                .catch();

}



exports.bookNow = (req, res, next)=>{

    let data = {
                userId:req.body.userId, 
                hotelId: req.body.hotelId, 
                dtd: req.body.dtd, 
                guestNumber: req.body.guestNumber, 
                price: req.body.price, 
                hotelName: req.body.hotelName
            };

    let hotelBooking = new Booking(data);
    return hotelBooking
            .save()
            .then(data=>{

                let result = {status:true, msg:'Booking successfull on date '+req.body.dtd};
                return res.end(JSON.stringify(result));
            })
            .catch();

}

exports.bookingList = (req, res, next)=>{

    return Booking
                .find()
                .then(data=>{
                    
                    return res.end(JSON.stringify(data));
                })
                .catch();
}
