var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var UserSchema = new Schema({
  username: {type: String, index:{unique:true}},
  password: {type: String },

  name: {type: String},
  lastname: {type: String},

  admin: {type: Boolean},
  superadmin: {type: Boolean},
  area: { type: Schema.ObjectId, ref:'area'},
  role: { type: Schema.ObjectId, ref:'role'},
  scores: {type:[Number]},
  status: {type:String},
  email: {type:String},
  imageurl: {type:String},
  company: { type: Schema.ObjectId, ref:'company'},
  children: [{ type: Schema.ObjectId, ref:'user'}]

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
UserSchema.plugin(deepPopulate)//, options /* more on options below */);

module.exports = mongoose.model('user', UserSchema);
