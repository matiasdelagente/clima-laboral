var express = require('express');
var router = express.Router();
var Score = require('../models/ScoreModel.js')

router.route('/scores')
  .get(function(req,res){
    Score.find(function(err,data){
      if(err) res.send(err);
      res.send(data);
    });
  })
  .post(function(req,res){
    console.log(req.body);
    var score = new Score(req.body);
      score.save(function(err, data){
        if(err) res.send(err);
        res.send(data);
      });
  });

  router.route('/users')
    .get(function(req,res){
      User.find(function(err,data){
        if(err) res.send(err);
        res.send(data);
      });
    })
    .post(function(req,res){
      //console.log(req.body)
      var user = new User(req.body);
        user.save(function(err, data){
          if(err) res.send(err);
          res.send(data);
        });
    });
router.route('/scores/:id')
  .get(function(req,res){
    var id = req.params.id;
    Score.findById(id, function(err, data){
      if(err) res.send(err);
      res.send(data)
    });
  })
  .put(function(req,res){
    var id = req.params.id
    Score.findById(id, function(err,score){
      if(err) res.send(score)
      score.name = req.body.name
      score.password = req.body.password
      score.save(function(err,data){
        if(err) res.send(err)
        res.send(data)
      })
    })
  })
  .delete(function(req,res){
    var id = req.params.id
    User.findById(id, function(err, score){
      if(err) res.send(err)
      score.remove(function(err, data){
        if(err)res.send(err)
        res.send(data);
      })
    })
  })

module.exports = router
