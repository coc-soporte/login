var express = require('express');

var app = express();
var http = require('http').Server(app);

// variables globales de Socket.io
var io = require('socket.io')(http);

var bodyParser = require('body-parser');
var cors = require('cors');

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

//************************
var checkSocket = require('./socket/checkSocket');
checkSocket(io);
//**************************

http.listen(3000, function(){
	console.log('Listen on Port 3000');
});