var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var luyenNgheSchema = new Schema({
    idLuyenNghe: String,
    title: String,
    content: String,
    image: String
  }
);
var luyenNgheModel = mongoose.model("luyenNghe", luyenNgheSchema);

module.exports = luyenNgheModel;
