var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
  username: {type: String, index:{unique:true}},
  password: {type: String, select:false},
  admin: {type: Boolean},
  area: {type:String},
  role: {type:String},
  scores: {type:[Number]},
  status: {type:String},
  email: {type:String}
});

UserSchema.pre('save',function(next){
  var user = this;
  if(!user.isModified('password')) return next();
  bcrypt.hash(user.password, null, null, function(err, hash){
    if(err) return next(err);
    user.password = hash;
    next();
  });
});

UserSchema.methods.comparePassword = function (password){
  var user = this;
  return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('user', UserSchema);
