var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AwardSchema = new Schema({
  level: {type: String},
  date: {type: Date},
  reward: {type: String},
  reason: {type: String},
  user: {type: Schema.ObjectId, ref: 'user'}
});

module.exports = mongoose.model('award', AwardsSchema);
