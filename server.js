var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

var app = express();
//mongoose.connect('mongodb://admin:admin@apollo.modulusmongo.net:27017/piGeh9ow')
//mongoose.connect('mongodb://localhost/felicimetro')
mongoose.connect('mongodb://admin:admin@ds035633.mongolab.com:35633/heroku_8wlqtsm6');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var userRoutes = require('./routes/UserRoutes.js');
var scoreRoutes = require('./routes/ScoreRoutes.js');
var companyRoutes = require('./routes/CompanyRoutes.js');
var areaRoutes = require('./routes/AreaRoutes.js');
var roleRoutes = require('./routes/RoleRoutes.js');
var competenceRoutes = require('./routes/CompetenceRoutes.js');
var awsRoutes = require('./routes/AwsRoutes');

var router = express.Router();

router.use(userRoutes);
router.use(scoreRoutes);
router.use(companyRoutes);
router.use(areaRoutes);
router.use(roleRoutes);
router.use(competenceRoutes);
router.use(awsRoutes);
	
// todas los servicios van a estar bajo /api
app.use('/api', router);

app.use(express.static('public'));

var port = process.env.PORT || 3000;
app.listen(port);
