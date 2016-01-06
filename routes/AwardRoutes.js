var express = require('express');
var router = express.Router();
var Award = require('../models/AwardModel.js');
var User = require('../models/UserModel.js');

route.route('/awards')
    .get(function(req,res){
      Award.find(function(err, data){
        if(err){
          res.send(err)
        }
        else{
          res.send(data);
        }
      })
    })
    .post(function(req,res){
      var award = new Award(req.body);
    })
    award.save(function(err, award){
      if(err){
        res.send(err);
      }
      else{
        res.send(data)
      }
    })
