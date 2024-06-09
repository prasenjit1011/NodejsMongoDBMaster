const HotelModel    = require('../models/hotelModel');
const ReviewModel   = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const Contactus = require('../models/contactusModel');





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

exports.getHotelReview = (req, res, next)=>{

    let reviewdata = ['Hotel Review : ', req.params.hotelId];
    //return res.end(JSON.stringify(reviewdata));
    //
    
    return ReviewModel
                .find({'hotelId':req.params.hotelId})
                .then(data=>{                    

                    return res.end(JSON.stringify(data));
                })
                .catch();

}


exports.getHotelReviewDetails = (req, res, next)=>{

    let reviewdata = ['Review Details : ', req.params.reviewId];
    //return res.end(JSON.stringify(reviewdata));

    return ReviewModel
                .findById(req.params.reviewId)
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

exports.contactUs = (req, res, next) => {   
    
    const imageName = req.file.filename;
    const description = req.body.description;
  
    // Save this data to a database probably
  
    console.log(description, imageName)
    res.send({description, imageName})
    
    // let data = {
    //             firstName: req.body.firstName, 
    //             lastName: req.body.lastName, 
    //             mobileNumber: req.body.mobileNumber, 
    //             userEmail: req.body.userEmail, 
    //             msg: req.body.msg, 
    //         };
    let data = {
        file:req.body.file
    };

    console.log(data);
    let result = {status:true, msg:'Your msg successfully sent us'};
    console.log('-------'+parseInt(1000*Math.random())+'-----------');
    return res.end(JSON.stringify(result));

    let contactus = new Contactus(data);
    return contactus
            .save()
            .then(data=>{

                let result = {status:true, msg:'Your msg successfully sent us', details:data};
                return res.end(JSON.stringify(result));
            })
            .catch();
}