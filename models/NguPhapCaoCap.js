var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var nguPhapCaoCapSchema = new Schema({
    idCaoCap: Number,
    title: String,
    image: String,
    desc: String
  }
);
var nguPhapCaoCapModel = mongoose.model("NguPhapCaoCap", nguPhapCaoCapSchema);

module.exports = nguPhapCaoCapModel;
