var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AreaSchema = new Schema({
  name: {type: String},
  description: {type: String}
});

module.exports = mongoose.model('area', AreaSchema);
