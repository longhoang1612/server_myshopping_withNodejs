var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var nguPhapSchema = new Schema({
    idNguPhap: Number,
    title: String,
    linkVideo: String,
  }
);
var nguPhapModel = mongoose.model("NguPhap", nguPhapSchema);

module.exports = nguPhapModel;
