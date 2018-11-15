var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var phoneProduct = new Schema({
    type: String,
    price: String,
    deal:String,
    image: String,
    rating : Number,
    title: String,
    numberRating: String,
    listSale: [String],
    listExtraProduct:[{
        imageExtra : String,
        titleExtra : String,
        priceExtra : String
    }],
    listParameter:[{
        titlePara:String,
        contentPara:String
    }],
    titleH2:String,
    titleContent:String,
    linkVideo:String,
    topContentP:String,
    detailContent:[{
        title:String,
        image:String
    }],
    slider:[String]
  }
);
var phoneModel = mongoose.model("PhoneProduct", phoneProduct);

module.exports = phoneModel;
