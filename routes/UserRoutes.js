var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require('../models/UserModel.js');
var Company = require('../models/CompanyModel.js');
var superSecret = "123456";
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('yXbOSbsEdGY5XDGY1G4JMw');


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
        // console.log('sesion user:', user);
        res.json({success: true, message:"OK", token: token, session: user})
      }
    }
  }).select('username password id superadmin admin company').populate('company')
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
router.route('/usersByCompany/:id')
  .get(function(req,res){
    var companyId = req.params.id;
    // console.log(companyId)
    User.find({company: companyId}, function(err,data){
      if(err) res.send(err);
      // console.log(data)
      res.send(data);
    }).populate('company');
  })

router.route('/allByCompany/:id')
  .get(function(req,res){
    var companyId = req.params.id;

    User.find({company: companyId}, function(err,data){
      if(err) res.send(err);
      // console.log(data)
      res.send(data);
    }).populate('company');
  })

router.route('/users')
  .get(function(req,res){
    User.find(function(err,data){
      if(err) res.send(err);
      res.send(data);
    }).populate('company');
  })
  .post(function(req,res){
    var user = new User(req.body)
      
      user.save(function(err, data){
        //ONLY SEND MAIL IF IS A REGULAR USER
        if (!req.body.admin && req.body.sendMail) {
                  
          var mailJSON ={
            "template_name": "fts-invitacion", //"fts-invitacion-empresa"
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
              "from_email": "no-responder@fosteringtalent.com",
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
                "content": req.body.name
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
                // @TODO ACA HAY QUE PASAR EL NOMBRE DE LA COMPAÑÍA Y NO CON EL ID
                "name": "company",
                "content": req.body.companyName
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
        }

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
      user.superadmin = req.body.superadmin;
      if(req.body.area) user.area = req.body.area;
      if(req.body.role) user.role  = req.body.role;
      if(req.body.scores) user.scores = req.body.scores;
      if(req.body.status) user.status = req.body.status;
      if(req.body.email) user.email = req.body.email;
      if(req.body.company) user.company = req.body.company;
      if(req.body.name) user.name = req.body.name;
      if(req.body.lastname) user.lastname = req.body.lastname;
      
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

router.route('/users/setChildrens/:id')
  .put(function(req,res){
    var id = req.params.id 
    User.findById(id, function(err,user){
      if(err) res.send(user)

      // user.childrens = req.body;
      user.children = req.body;

      console.log(user.childrens)
      user.save(function(err,data){
        if(err) res.send(err)
        res.send(data)
      })
    })
  })


router.route('/me')
.get(function(req,res){
  User.findOne({username: req.decoded.username}, function(err, user){
    if(err) return err;
    res.send(user)
  })
  //res.send(req.decoded);
})


module.exports = router
