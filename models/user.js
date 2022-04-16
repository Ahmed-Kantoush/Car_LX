const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    _id: {
      type: String,
      required: true 
    },
    password: {
        type: String,
        required: true  
    },
    name: {
      type: String,
      required: true  
    },
    city: {
      type: String,
      required: true  
    },
    phone: {
      type: String,
      required: true  
    },
    verified: {
      type: String,
      required: true  
    },
    interested: {
      type: String,
      required: true  
    },
    cars: {
      type: String,
      required: true  
    },
    reqs: {
      type: String,
      required: true  
    },
    favs: {
      type: String,
      required: true  
    },
    img: {
      data: Buffer,
      contentType: String
    },
});

const User = mongoose.model('user', userSchema);

module.exports = User;