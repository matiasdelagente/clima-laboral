var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompetenceSchema = new Schema({
  name: {type: String},
  description: {type: String},
  areas: [{ type: Schema.ObjectId, ref:'area'}],
  roles: [{ type: Schema.ObjectId, ref:'role'}]
});

module.exports = mongoose.model('competence', CompetenceSchema);
