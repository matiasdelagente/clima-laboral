var express = require('express');
var router = express.Router();
var Competence = require('../models/CompetenceModel.js');
var User = require('../models/UserModel.js');

router.route('/competencies')
    .get(function(req,res){
      Competence.find(function(err, data){
        if(err){
          res.send(err);
        }
        else{
          console.log(data);
          res.send(data);
        }
      });
    })
    .post(function(req,res){
      var competence = new Competence(req.body);
      console.log(competence);
      competence.save(function(err, competence){
        if(err){
          res.send(err);
        }
        else{
          res.send(competence);
        }
      });
    });

router.route('/competencies/:id')
    .get(function(req,res){
      var id = req.params.id;
      Competence.findById(id, function(err, data){
        if(err) res.send(err);
        // console.log(data)
        res.send(data);
      });
    })
    .put(function(req,res){
      var id = req.params.id;
      Competence.findById(id, function(err, competence){
        if(err) res.send(err);
        if(req.body.name) competence.name = req.body.name;
        if(req.body.description) competence.description = req.body.description;

        competence.save(function(err,data){
          // console.log(data)
          if(err) res.send(err);
          res.send(data);
        });
      });
    })
    .delete(function(req,res){
      var id = req.params.id;

      Competence.findById(id, function(err, competence){
        if(err) res.send(err);
        competence.remove(function(err, data){
          if(err)res.send(err);
          res.send(data);
        });
      });
    });

router.route('/competencies/allByUsers')
    .get(function(req,res){
      User.find(function(err, data){
        if(err){
          res.send(err);
        }
        else{
          console.log(data);
          res.send(data);
        }
      });
    });

router.route('/competencies/allByUser/:id')
    .get(function(req,res){
      var id = req.params.id;
      Competence.find({user: id},function(err, data){
        if(err){
          res.send(err);
        }
        else{
          console.log(data);
          res.send(data);
        }
      });
    });

router.route('/competencies/allByCompany/:id')
    .get(function(req,res){
      var id = req.params.id;
      User.find({company: id}, function(err,data){
        if(err){
          res.send(err);
        }
        else{
          data.forEach(function (user){
            Competence.find({'user': user._id},function(err, competencies){
              if(err){
                res.send(err);
              }
              else{
                data.competencies = competencies;
              }
            });
          });
          console.log(data);
          res.send(data);
        }
      });
    });

module.exports = router;
