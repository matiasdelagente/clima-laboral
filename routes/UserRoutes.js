var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require('../models/UserModel.js');
var superSecret = "123456";

router.route('/authenticate')
.post(function(req,res){
  User.findOne({username: req.body.username},function(err, user){
    if(err) throw err;
    if(!user) res.json({success:false, message:"EL USUARIO NO EXISTE"})
    else {
      var valid = user.comparePassword(req.body.password)
      if(!valid) res.json({success: false, message: "LA CONTRASEÑA ES ERRONEA"})
      else {
        var token = jwt.sign({
          username: req.body.username
        },superSecret,{
          expireInMinutes: 1440
        });
        res.json({success: true, message:"OK", token: token})
      }
    }
  }).select('username password')
})
router.use(function(req, res, next){
  var token = req.body.token || req.query.token || req.headers['x-access-token']
  if(token){
    jwt.verify(token, superSecret, function(err,decoded){
      if(err){
        res.status(403).send({
          success: false,
          message: "incorrect token"
        })
      }
      else {
        req.decoded = decoded
        next();
      }
    })
  }
  else {
    res.status(403).send({
      success:false,
      message: 'No token found'
    })
  }
})
router.route('/users')
  .get(function(req,res){
    User.find(function(err,data){
      if(err) res.send(err);
      res.send(data);
    });
  })
  .post(function(req,res){
    var user = new User(req.body)
      user.save(function(err, data){
        if(err) res.send(err);
        res.send(data);
      });
  });
router.use('/users/:id',function(req, res, next){
  var token = req.body.token || req.query.token || req.headers['x-access-token']
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
      if(req.body.username) user.username = req.body.username;
      if(req.body.password) user.password = req.body.password;
      user.admin = req.body.admin;
      if(req.body.area) user.area = req.body.area;
      if(req.body.role) user.role  = req.body.role;
      if(req.body.scores) user.scores = req.body.scores;
      if(req.body.status) user.status = req.body.status;
      if(req.body.email) user.email = req.body.email;
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

router.route('/me')
.get(function(req,res){
  User.findOne({username: req.decoded.username}, function(err, user){
    if(err) return error;
    res.send(user)
  })
  //res.send(req.decoded);
})

module.exports = router
