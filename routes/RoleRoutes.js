var express = require('express');
var router = express.Router();
var Role = require('../models/RoleModel.js');
var User = require('../models/UserModel.js');

router.route('/roles')
    .get(function(req,res){
      Role.find(function(err, data){
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
      console.log("holis");
      var role = new Role(req.body);
      console.log(role);
      role.save(function(err, role){
        if(err){
          res.send(err);
        }
        else{
          res.send(role);
        }
      });
    });

router.route('/roles/:id')
    .get(function(req,res){
      var id = req.params.id;
      Role.findById(id, function(err, data){
        if(err) res.send(err);
        // console.log(data)
        res.send(data);
      });
    })
    .put(function(req,res){
      var id = req.params.id;
      Role.findById(id, function(err, role){
        if(err) res.send(err);
        if(req.body.name) role.name = req.body.name;
        if(req.body.description) role.description = req.body.description;

        role.save(function(err,data){
          // console.log(data)
          if(err) res.send(err);
          res.send(data);
        });
      });
    })
    .delete(function(req,res){
      var id = req.params.id;

      Role.findById(id, function(err, role){
        if(err) res.send(err);
        role.remove(function(err, data){
          if(err)res.send(err);
          res.send(data);
        });
      });
    });

router.route('/roles/allByUsers')
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

router.route('/roles/allByUser/:id')
    .get(function(req,res){
      var id = req.params.id;
      Role.find({user: id},function(err, data){
        if(err){
          res.send(err);
        }
        else{
          console.log(data);
          res.send(data);
        }
      });
    });

router.route('/roles/allByCompany/:id')
    .get(function(req,res){
      var id = req.params.id;
      Role.find({company: id},function(err, data){
        if(err){
          res.send(err);
        }
        else{
          console.log(data);
          res.send(data);
        }
      });
    });

module.exports = router;
