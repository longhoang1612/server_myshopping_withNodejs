var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var nguPhapTrungCapSchema = new Schema({
    idTrungCap: Number,
    title: String,
    image: String,
    desc: String
  }
);
var nguPhapTrungCapModel = mongoose.model("NguPhapTrungCap", nguPhapTrungCapSchema);

module.exports = nguPhapTrungCapModel;
