var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentProduct = new Schema({
    date:String,
    idProduct:String,
    nameProduct:String,
    nameUser:String,
    imageComment:String,
    titleComment:String,
    comment:String,
    rating:Number
  }
);
var commentModel = mongoose.model("Comment", commentProduct);

module.exports = commentModel;
