var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var phoneCategorySchema = new Schema({
    idCategory:Number,
    imageCategory: String,
    listProduct: [{
        name: String,
        quantity: Number,
        price: String,
        description: String,
        deal:Number,
        listImage: String
    }],
  }
);
var phoneCategoryModel = mongoose.model("PhoneCategory", phoneCategorySchema);

module.exports = phoneCategoryModel;
