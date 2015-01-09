var express = require('express');
var mysql = require('mysql');

var rutasLogin = express.Router();

//----------------------------------------------
var connection = mysql.createConnection({
  host     : '10.66.6.240',
  user     : 'ricardo',
  password : 'ricardo'
});
//----------------------------------------------

rutasLogin.route('/')
.get(function(req, res){

	connection.query("SELECT * FROM gtr.infocde WHERE REGION = 'CENTRO'", function(err, rows, fields) {
	  	if (err) throw err;
	  	res.json(rows);
	});
});

module.exports = rutasLogin;