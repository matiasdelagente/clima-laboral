var express = require('express');
var router = express.Router();
var Company = require('../models/CompanyModel.js');
var User = require('../models/UserModel.js');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('yXbOSbsEdGY5XDGY1G4JMw');

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
        // console.log(req.body)
        var mailJSON ={
          "template_name": "fts-invitacion-empresa",
          "template_content": [
          {
            "name": "",
            "content": ""
          }
          ],
          "message": {
            "html": "",
            "text": "",
            "subject": "",
            "from_email": "no-responder@fosterintalent.com",
            "from_name": "Fostering Talent",
            "to": [
            {
              "email": req.body.email,
              "name": req.body.user_name,
              "type": "to"
            }
            ],
            "important": false,
            "track_opens": null,
            "track_clicks": null,
            "auto_text": null,
            "auto_html": null,
            "inline_css": null,
            "url_strip_qs": null,
            "preserve_recipients": null,
            "view_content_link": null,
            "tracking_domain": null,
            "signing_domain": null,
            "return_path_domain": null,
            "global_merge_vars": [
            {
              "name": "user_name",
              "content": req.body.user_name
            },
            {
              "name": "username",
              "content": req.body.username
            },
            {
              "name": "password",
              "content": req.body.password
            },
            {
              "name": "company",
              "content": req.body.company
            },
            {
              "name": "URLEmpresa",
              "content": req.body.URLEmpresa
            }
            ]
          },
          "async": false,
          "ip_pool": "Main Pool"
        };

        mandrill_client.messages.sendTemplate(mailJSON, 
        function(result) {
          // console.log(result);
        },function(e) {
          // Mandrill returns the error as an object with name and message keys
          // console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
          // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
        });


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

router.route('/companyByUser/:id')
  .get(function(req,res){
    var userId = req.params.id;

    Company.findOne({user: userId}, function(err,data){
      if(err) res.send(err);
      console.log(data)
      res.send(data);
    });
  })

module.exports = router