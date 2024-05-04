const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/user');

module.exports = {

  randomNumber(){
    return {
      text:"New World",
      views:parseInt(100*Math.random())
    }
  },

  hello(){
    return {
      text:"Hello World",
      views:4521
    }
  },

  createUser: async function({ userInput }, req) {

    const errors = [];
    if(!validator.isEmail(userInput.email)){
      errors.push({message:'Email is invalid.'});
    }

    if(errors.length){
      const error   = new Error('Invalid input.');
      error.data    = errors;
      error.status  = 422;
      throw error;
    }
    //   const email = args.userInput.email;
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error('User exists already!');
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  }
};
