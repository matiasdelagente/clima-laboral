var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

var app = express()
//mongoose.connect('mongodb://admin:admin@apollo.modulusmongo.net:27017/piGeh9ow')
//mongoose.connect('mongodb://localhost/felicimetro')
mongoose.connect('mongodb://admin:admin@ds035633.mongolab.com:35633/heroku_8wlqtsm6')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var userRoutes = require('./routes/UserRoutes.js')
var scoreRoutes = require('./routes/ScoreRoutes.js')

app.use('/api', userRoutes);
app.use('/api', scoreRoutes);

app.use(express.static('public'));

var port = process.env.PORT || 3000
app.listen(port);
