var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var CompanySchema = new Schema({
  name: {type: String},
  email: {type: String},
  url: {type: String},
  maxUsers: {type: Number},
  demo: {type: Boolean},
  user:{ type: Schema.Types.ObjectId, ref:'user'}
});

// CompanySchema.pre('save',function(next){
//   // var user = this;
//   // if(!user.isModified('password')) return next();
//   // bcrypt.hash(user.password, null, null, function(err, hash){
//   //   if(err) return next(err);
//   //   user.password = hash;
//   //   next();
//   // });
// });

// CompanySchema.methods.comparePassword = function (password){
//   var user = this;
//   return bcrypt.compareSync(password, user.password);
// };

module.exports = mongoose.model('company', CompanySchema);
