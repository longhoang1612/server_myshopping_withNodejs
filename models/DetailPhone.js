var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var detailSchema = new Schema({
    title: String,
    rating: Number,
    numberRating: String,
    price: String,
    sale:String,
    listSale: [String],
    listExtraProduct:[{
        imageExtra:String,
        titleExtra:String
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
var detailModel = mongoose.model("PhoneDetail", detailSchema);

module.exports = detailModel;
