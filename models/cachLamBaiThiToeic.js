var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var cachLamBaiThiToeicSchema = new Schema({
    id: Number,
    title: String,
    linkVideo: String,
  }
);
var cachLamModel = mongoose.model("CachLam", cachLamBaiThiToeicSchema);

module.exports = cachLamModel;
