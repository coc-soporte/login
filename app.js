var express = require('express');
var mysql = require('mysql');

var app = express();
app.use(express.static(__dirname + '/public'));


//----------------------------------------------
var connection = mysql.createConnection({
  host     : '10.66.6.240',
  user     : 'ricardo',
  password : 'ricardo'
});
var consulta = [];

function getQuery(){

}
//----------------------------------------------

app.get('/query', function(req, res){	
	//connection.connect();
	connection.query("SELECT * FROM gtr.infocde WHERE REGION = 'CENTRO'", function(err, rows, fields) {
	  	if (err) throw err;
	  	res.json(rows);
	});

	//connection.end();	
});


app.listen(3000, function(){
	console.log('Listen on Port 3000');
});