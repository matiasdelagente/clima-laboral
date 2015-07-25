var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScoreSchema = new Schema({
  scores: [Number]
});

module.exports = mongoose.model('score', ScoreSchema);
