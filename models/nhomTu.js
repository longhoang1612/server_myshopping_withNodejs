var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var nhomTuSchemal = new Schema({
    idNhomTu: String,
    tenNhomTu: String,
    anhMinhHoa: String,
  }
);
var nhomTuModel = mongoose.model("nhomTu", nhomTuSchemal);

module.exports = nhomTuModel;
