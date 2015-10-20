var express = require('express');
var router = express.Router();
var Company = require('../models/CompanyModel.js');
var User = require('../models/UserModel.js');

router.route('/companies')
  .get(function(req, res){
    Company.find(function(err, data){
      if (err) {
        res.send(err)
      } else {
        res.send(data)
      }
    })
  })

  .post(function(req, res){
    var company = new Company(req.body);
    company.save(function(err, data){
      if (err) {
        res.send(err)
      } else {
        //@TODO create admin user
        res.send(data)
      }
    })
  });

router.route('/companies/:id')
  .get(function(req,res){
    var id = req.params.id;
    Company.findById(id, function(err, data){
      if(err) res.send(err);
      res.send(data)
    });
  })
  .put(function(req,res){
    var id = req.params.id
    Company.findById(id, function(err,user){
      // if(err) res.send(user)
      // if(req.body.username) user.username = req.body.username;
      // if(req.body.password) user.password = req.body.password;
      // user.admin = req.body.admin;
      // user.superadmin = req.body.superadmin;
      // if(req.body.area) user.area = req.body.area;
      // if(req.body.role) user.role  = req.body.role;
      // if(req.body.scores) user.scores = req.body.scores;
      // if(req.body.status) user.status = req.body.status;
      // if(req.body.email) user.email = req.body.email;
      // user.save(function(err,data){
      //   if(err) res.send(err)
      //   res.send(data)
      // })
    })
  })
  .delete(function(req,res){
    var id = req.params.id
    Company.findById(id, function(err, user){
      if(err) res.send(err)
      user.remove(function(err, data){
        if(err)res.send(err)
        res.send(data);
      })
    })
  })


module.exports = router