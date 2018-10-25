var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var newsfeedSchema = new Schema({
    // id: Number,
    
    avatarAuthor: String,
    author: String,
    numLike: Number,
    numberCommet: Number,
    description: String,
    commentList: [{
        cmAvatar: String,
        cmtName: String,
        idAuthorComment: String,
        dateComment:{
            type: Date,
            default: Date.now
        }
    }],
    date: {
        type: Date,
        default: Date.now
    },
  }
);
var newsfeedModel = mongoose.model("newsmodel", newsfeedSchema);

module.exports = newsfeedModel;
