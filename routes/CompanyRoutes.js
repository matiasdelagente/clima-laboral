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
  })

module.exports = router