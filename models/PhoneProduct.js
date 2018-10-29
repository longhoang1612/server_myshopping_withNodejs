var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var phoneProduct = new Schema({
    type: String,
    name: String,
    price: String,
    description: String,
    deal:String,
    image: String,
    rating : Number,
    numberRating: String,
    info:String,
  }
);
var phoneModel = mongoose.model("PhoneProduct", phoneProduct);

module.exports = phoneModel;
