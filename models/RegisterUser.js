var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var registerSchema = new Schema({
  email:String,
  password:String,
  salt:String,
  fullname:String,
  dateJoin:String,
  sex:String,
  address:[{
      phoneNumber:String,
      addressOrder:String,
      userNameOrder:String
  }],
  favorites: [{
      titleFav:String,
      imageFav:String,
      priceFav:String,
      ratingFav:Number,
      countRatingFav: String
  }],
  cartCurrent:[{
    titleItem:String,
    priceItem:String,
    imageItem:String,
    quantityItem:Number
  }],
  date: String,
  }
);
var registerModel = mongoose.model("Customer", registerSchema);

module.exports = registerModel;
