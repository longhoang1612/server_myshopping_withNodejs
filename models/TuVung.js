var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var newWordSchemal = new Schema({
    id: String,
    content: String,
    idNhomTu: String,
    image: String,
    audio: String,
  }
);
var newWordModel = mongoose.model("newword", newWordSchemal);

module.exports = newWordModel;
