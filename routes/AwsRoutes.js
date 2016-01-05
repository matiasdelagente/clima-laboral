var express = require('express');
var router = express.Router();
var aws = require('aws-sdk');

router.route('/sign_s3')
.get(function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) return res.status(403).send({message: 'DEBES ESTAR LOGUEADO'});
  
  var fileName = Date.now() + '_' + req.query.file_name;
  
  /*
   * Load the S3 information from the environment variables.
   * Credenciales de UploadImagesUser
   */
  var AWS_ACCESS_KEY = 'AKIAJ44XZFJKNHPNOTQA';
  var AWS_SECRET_KEY = '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';
  var S3_BUCKET = 'fostering-images';
  
  aws.config.update({accessKeyId: AWS_ACCESS_KEY , secretAccessKey: AWS_SECRET_KEY });
  aws.config.update({region: 'sa-east-1' , signatureVersion: 'v4' });
  var s3 = new aws.S3();
  var s3_params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: req.query.file_type,
    ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', s3_params, function(err, data) {
    if(err) {
      console.log(err);
    } else {
      var return_data = {
        signed_request: data,
        url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+fileName
      };
      res.write(JSON.stringify(return_data));
      res.end();
    }
  });

});

module.exports = router;