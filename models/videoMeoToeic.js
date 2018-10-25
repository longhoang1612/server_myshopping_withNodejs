var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var videoMeoToeicSchema = new Schema({
    id: Number,
    name: String,
    time: String,
    image: String,
    url: String
  }
);
var videoMeoToeicModel = mongoose.model("VideoMeoToeic", videoMeoToeicSchema);

module.exports = videoMeoToeicModel;
