var express = require('express');
var mysql = require('mysql');
var _ = require("underscore");

//----------------------------------------------
var pool = mysql.createPool({
  connectionLimit : 100,
  host     : '10.66.6.240',
  user     : 'ricardo',
  password : 'ricardo'
});
//----------------------------------------------

var ioConect = function(io){

	io.on('connection', function(socket){
		  console.log('a user connected');

		  socket.on('checkMessageIn', function(msg){

		  	var query = "SELECT * FROM bd_cded_cde_pda.checklist order by ch_log desc limit 10";
	 	
		 	pool.query(query , function(err, rows, fields) {
		 		if (err){
		 			io.emit('checkMessageOut', {status: '400'});
		 			return;
		 		}		 		
		 		io.emit('checkMessageOut', rows);
		 	});
			  	
		  	console.log('message: ' + msg);  

		  });

	});
};


module.exports = ioConect;