var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var nguPhapSoCapSchema = new Schema({
    idSoCap: Number,
    title: String,
    image: String,
    desc: String
  }
);
var nguPhapSoCapModel = mongoose.model("NguPhapSoCap", nguPhapSoCapSchema);

module.exports = nguPhapSoCapModel;
