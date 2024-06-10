const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const contactusSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobileNumber: {type: String, require: true },
    userEmail: { type: String, required: false },
    imgSrc: { type: String, required: false },
    msg: { type: String, required: true}
});

contactusSchema.set('timestamps', true);

module.exports = mongoose.model('contactus', contactusSchema);