var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoleSchema = new Schema({
  name: {type: String},
  description: {type: String},
  company: { type: Schema.ObjectId, ref:'company'}
});

module.exports = mongoose.model('role', RoleSchema);
