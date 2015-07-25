var express = require('express');
var jwt = require('jsonwebtoken')
var router = express.Router();
var User = require('../models/UserModel.js')
var superSecret = "123456"

router.route('/authenticate')
.post(function(req,res){
  User.findOne({name: req.body.name})
      .select('name password')
      .exec(function(err, user){
        if(err) throw err;
        if(!user) res.json({success:false, message:"no user found"})
        else {
          var valid = user.comparePassword(req.body.password)
          if(!valid) res.json({success: false, message: "wrong password"})
          else {
            var token = jwt.sign({
              name: req.body.name,
              username: req.body.username
            },superSecret,{
              expireInMinutes: 1440
            });
            res.json({success: true, message:"OK", token: token})
          }
        }
      })
})
router.route('/users')
  .get(function(req,res){
    User.find(function(err,data){
      if(err) res.send(err);
      res.send(data);
    });
  })
  .post(function(req,res){
    console.log(req.params)
    console.log(req.param)
    var user = new User(req.body);
      user.save(function(err, data){
        if(err) res.send(err);
        res.send(data);
      });
  });
router.use('/users/:id',function(req, res, next){
  console.log(req)
  var token = req.body.token || req.param('token') || req.headers['x-access-token']
  next();
});
router.route('/users/:id')
  .get(function(req,res){
    var id = req.params.id;
    User.findById(id, function(err, data){
      if(err) res.send(err);
      res.send(data)
    });
  })
  .put(function(req,res){
    var id = req.params.id
    User.findById(id, function(err,user){
      if(err) res.send(user)
      user.name = req.body.name
      user.password = req.body.password
      user.save(function(err,data){
        if(err) res.send(err)
        res.send(data)
      })
    })
  })
  .delete(function(req,res){
    var id = req.params.id
    User.findById(id, function(err, user){
      if(err) res.send(err)
      user.remove(function(err, data){
        if(err)res.send(err)
        res.send(data);
      })
    })
  })

module.exports = router
