var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var funnyEnglishSchema = new Schema({
    id: Number,
    title: String,
    image: String,
  }
);
var funnyModel = mongoose.model("FunnyEnglish", funnyEnglishSchema);

module.exports = funnyModel;
