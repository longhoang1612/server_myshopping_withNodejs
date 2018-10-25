var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var detailLuyenNgheSchema = new Schema({
    idLuyenNghe: String,
    title: String,
    content: String,
    link: String,
    transcript: String,
    tuvung: String,
    image: String,
    quantam: [{
        idQT: String,
        imageQT: String,
        titleQT: String
    }]
  }
);
var detailLuyenNgheModel = mongoose.model("DetailLuyenNghe", detailLuyenNgheSchema);

module.exports = detailLuyenNgheModel;
