var express = require('express');
var bodyParser = require('body-parser');
cors = require('cors');

//var mysql = require('mysql');
var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));


var rutasLogin = require('./routes/rutasLogin');
app.use('/login', rutasLogin);

var rutasAdmin = require('./routes/rutasAdmin');
app.use('/admin', rutasAdmin);

var rutasCheck = require('./routes/rutasCheck');
app.use('/check', rutasCheck);

app.listen(3000, function(){
	console.log('Listen on Port 3000');
});