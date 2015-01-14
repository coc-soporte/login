var express = require('express');
var bodyParser = require('body-parser');

//var mysql = require('mysql');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));


var rutasLogin = require('./routes/rutasLogin');
app.use('/login', rutasLogin);

app.listen(3000, function(){
	console.log('Listen on Port 3000');
});