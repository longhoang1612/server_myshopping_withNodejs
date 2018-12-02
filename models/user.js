var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Food = require('./food');

var userSchema = new Schema({
    imageAvatar: String,
    fullName: String,
    userName:String,
    email: String,
    password:String,
    sex:String
    //listFavorite: [{type: Schema.Types.ObjectId, ref: 'Food'}] // list of id (ref)
  }
);

var userModel = mongoose.model("User", userSchema);

module.exports = userModel;
