var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var newsfeedSchema = new Schema({    
    slideImage: [String],
    km:[{
        href: String,
        image: String,
        titleItem: String,
        newPrice: String,
        shockprice :String,
        discount :String,
        installment :String,
        pre:String
    }],
    phone:[{
        href : String,
        image : String,
        title :String,
        price :String,
        shockprice :String,
        discount :String,
        installment :String,
        promo :String,
        imagePromo :String,
    }],
    laptop:[{
        href :String,
        image :String,
        title :String,
        price:String,
        installment :String,
        promo:String,
        imagePromo :String,
    }],
    accessories:[{
        href :String,
        title :String,
        price :String,
        per :String
    }]
  }
);
var newsfeedModel = mongoose.model("newsfeedmodel", newsfeedSchema);

module.exports = newsfeedModel;
