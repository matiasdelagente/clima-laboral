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
      console.log(data)
      res.send(data)
    });
  })
  .put(function(req,res){
    var id = req.params.id
    Company.findById(id, function(err, company){
      if(err) res.send(err)
      if(req.body.email) company.email = req.body.email;
      if(req.body.name) company.name = req.body.name;
      if(req.body.maxUsers) company.maxUsers = req.body.maxUsers;

      company.save(function(err,data){
        console.log(data)
        if(err) res.send(err)
        res.send(data)
      })
    })
  })
  .delete(function(req,res){
    var id = req.params.id
    
    Company.findById(id, function(err, company){
      if(err) res.send(err)
      company.remove(function(err, data){
        if(err)res.send(err)
        res.send(data);
      })
    })
  })

<<<<<<< HEAD
=======
router.route('/companyByUser/:id')
  .get(function(req,res){
    var userId = req.params.id;

    Company.findOne({user: userId}, function(err,data){
      if(err) res.send(err);
      console.log(data)
      res.send(data);
    });
  })
>>>>>>> multi_empresa

module.exports = router