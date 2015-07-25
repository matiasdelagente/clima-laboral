var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

var app = express()
mongoose.connect('mongodb://admin:admin@apollo.modulusmongo.net:27017/piGeh9ow')
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var routes = require('./routes/ScoreRoutes.js')
app.use('/', routes);

app.use(express.static('public'));

var port = process.env.PORT || 3000
app.listen(port);
