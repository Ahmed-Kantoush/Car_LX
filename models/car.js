const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const carSchema = new Schema({
    brand: {
      type: String,
      required: true  
    },
    name: {
      type: String,
      required: true  
    },
    seller_name: {
        type: String,
        required: true  
    },
    price: {
      type: String,
      required: true  
    },
    city: {
      type: String,
      required: true  
    },
    img1: {
      data: Buffer,
      contentType: String
    },
    img2: {
      data: Buffer,
      contentType: String
    },
    img3: {
      data: Buffer,
      contentType: String
    },
    model: {
      type: String,
      required: true  
    },
    distance: {
      type: String,
      required: true  
    },
    sid: {
      type: String,
      required: true  
    },
    cnt: {
      type: Number,
      required: true  
    }
});

const Car = mongoose.model('car', carSchema);

module.exports = Car;