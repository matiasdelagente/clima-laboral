var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoleSchema = new Schema({
  name: {type: String},
  description: {type: String}
});

module.exports = mongoose.model('role', RoleSchema);
