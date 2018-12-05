var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var orderProduct = new Schema({

    idUser:String,
    typeOrder: String,
    dateOrder:String,
    statusOrder:String,
    addressUser: String,
    nameUser:String,
    phoneNumber:String,
    typePayment:String,
    cart: [{
        titleItem:String,
        imageItem:String,
        priceItem:String
    }],
  }
);
var orderModel = mongoose.model("OrderProduct", orderProduct);

module.exports = orderModel;
