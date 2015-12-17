var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var CompanySchema = new Schema({
  name: {type: String},
  email: {type: String},
  url: {type: String},
  maxUsers: {type: Number},
  demo: {type: Boolean},
  user: {type: Schema.ObjectId, ref:'user'},
  areas: [{type: Schema.ObjectId, ref:'area'}],
  roles: [{type: Schema.ObjectId, ref:'role'}],
  competencies: [{type: Schema.ObjectId, ref:'competence'}],
});
CompanySchema.plugin(deepPopulate)//, options /* more on options below */);

module.exports = mongoose.model('company', CompanySchema);
