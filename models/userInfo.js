var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userInfoSchema = new Schema({
    imageAvatar: String,
    fullName: String,
    userName:String,
    email: String,
    password:String,
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
    date: String,
  }
);
var userModel = mongoose.model("userModel", userInfoSchema);

module.exports = userModel;
