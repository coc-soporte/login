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
		  //console.log('a user connected');

		  socket.on('checkMessageIn', function(msg){

			// Esta Consulta selectiona el checklist mas reciente de cada CDE
			var query = "SELECT * FROM bd_cded_cde_pda.checklist AS checklist " +
						"JOIN (	SELECT ch_codPos as ch_codPos2, MAX(ch_log) as Max_ch_log FROM bd_cded_cde_pda.checklist where cast(ch_log as date) = curdate() GROUP BY ch_codPos) d " +
						"ON ch_log = Max_ch_log and d.ch_codPos2 = checklist.ch_codPos " +
						"join (SELECT Cod_Pos, Regional, Tienda FROM bd_cded_cde_pda.tiendas) as tienda " +
						"ON ch_codPos = Cod_Pos " +
						"order by Regional, Tienda";
	 	
		 	pool.query(query , function(err, rows, fields) {
		 		if (err){
		 			io.emit('checkMessageOut', {status: '400'});
		 			return;
		 		}		 		
		 		io.emit('checkMessageOut', rows);
		 	});
			  	
		  	//console.log('message: ' + msg);  

		  });

	});
};


module.exports = ioConect;