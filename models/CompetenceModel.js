var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompetenceSchema = new Schema({
  name: {type: String},
  description: {type: String}
});

module.exports = mongoose.model('competence', CompetenceSchema);
