var express = require('express');
var router = express.Router();
var Area = require('../models/AreaModel.js');
var User = require('../models/UserModel.js');

router.route('/areas')
    .get(function(req,res){
      Area.find(function(err, data){
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
      var area = new Area(req.body);
      console.log(area);
      area.save(function(err, area){
        if(err){
          res.send(err);
        }
        else{
          res.send(area);
        }
      });
    });

router.route('/areas/:id')
    .get(function(req,res){
      var id = req.params.id;
      Area.findById(id, function(err, data){
        if(err) res.send(err);
        // console.log(data)
        res.send(data);
      });
    })
    .put(function(req,res){
      var id = req.params.id;
      Area.findById(id, function(err, area){
        if(err) res.send(err);
        if(req.body.name) area.name = req.body.name;
        if(req.body.description) area.description = req.body.description;

        area.save(function(err,data){
          // console.log(data)
          if(err) res.send(err);
          res.send(data);
        });
      });
    })
    .delete(function(req,res){
      var id = req.params.id;

      Area.findById(id, function(err, area){
        if(err) res.send(err);
        area.remove(function(err, data){
          if(err)res.send(err);
          res.send(data);
        });
      });
    });

router.route('/areas/allByUsers')
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

router.route('/areas/allByUser/:id')
    .get(function(req,res){
      var id = req.params.id;
      Area.find({user: id},function(err, data){
        if(err){
          res.send(err);
        }
        else{
          console.log(data);
          res.send(data);
        }
      });
    });

router.route('/areas/allByCompany/:id')
    .get(function(req,res){
      var id = req.params.id;
      User.find({company: id}, function(err,data){
        if(err){
          res.send(err);
        }
        else{
          data.forEach(function (user){
            Area.find({'user': user._id},function(err, areas){
              if(err){
                res.send(err);
              }
              else{
                data.areas = areas;
              }
            });
          });
          console.log(data);
          res.send(data);
        }
      });
    });

module.exports = router;
