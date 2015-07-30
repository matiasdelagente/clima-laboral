var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

var app = express()
mongoose.connect('mongodb://admin:admin@apollo.modulusmongo.net:27017/piGeh9ow')
mongoose.connect('mongodb://localhost/felicimetro')
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var scoreRoutes = require('./routes/ScoreRoutes.js')
var userRoutes = require('./routes/UserRoutes.js')
app.use('/api', scoreRoutes);
app.use('/api', userRoutes);

app.use(express.static('public'));

var port = process.env.PORT || 3000
app.listen(port);
