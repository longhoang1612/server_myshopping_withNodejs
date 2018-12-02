var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userInfoSchema = new Schema({
    imageAvatar: String,
    fullName: String,
    userName:String,
    email: String,
    password:String,
    sex:String,
    listFavorites: [{
        // idPost: String,
        // datePost: {
        //     type: Date,
        //     default: Date.now
        // }
    }],
    date: String,
  }
);
var userModel = mongoose.model("userModel", userInfoSchema);

module.exports = userModel;
