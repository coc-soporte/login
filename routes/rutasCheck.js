var express = require('express');
var mysql = require('mysql');
var moment = require('moment');
var _ = require("underscore");

var rutasCheck = express.Router();

//----------------------------------------------
var pool = mysql.createPool({
  connectionLimit : 100,
  host     : '10.66.6.240',
  user     : 'ricardo',
  password : 'ricardo'
});
//----------------------------------------------
rutasCheck.route('/')
.get(function(req, res){
	console.log('adsf');
});


rutasCheck.route('/getCheckListCDEid/:codpos/:id')
.get(function(req, res){

	var codpos = req.params.codpos;
	var userId = req.params.id;
	
	if (_.size(codpos) > 0 && _.size(userId) > 0) {

		var query = "SELECT * FROM bd_cded_cde_pda.checklist where cd_id = '" + userId 
				+ "' and ch_codPos = '" + codpos + "'";
		
		pool.query(query, function(err, rows, fields) {
		  	if (err){res.status(400).json({status: '400'});return;}
		  	res.json(rows);
		});
	}else{
		res.status(404).json({status: '404'});
	}
});

rutasCheck.route('/checkListCDE')
.get(function(req, res){
	
	var Cod_Pos = req.query.codpos;
	var paginacion = req.query.paginacion*10;

	if (_.size(Cod_Pos) > 0) {

		var query = "SELECT * FROM bd_cded_cde_pda.checklist where ch_codPos = '" + Cod_Pos + "' order by ch_log desc limit " 
			+ paginacion + ", 10";
	 	
	 	pool.query(query , function(err, rows, fields) {
	 		if (err){res.status(400).json({status: '400'});return;}
	 		res.json(rows);
	 	});
	}else{
		res.status(404).json({status: '404'});
	}

})
.post(function(req, res){

	var post = req.body;

	if (_.size(post) > 0) {
			var query = pool.query('INSERT INTO bd_cded_cde_pda.checklist SET ?', post , function(err, rows, fields) {
			if (err){res.status(400).json({status: '400'});return;}
				res.json(rows);
			});
	}else{
		res.status(404).json({status: '404'});
	}
});

rutasCheck.route('/checkListCDEbyDate')
.get(function(req, res){

	var date = req.query.date;
	if (_.size(date) == 0) {
		date = "curdate()"
	}else if(moment(date)._d == "Invalid Date"){
		res.status(400).json({status: '400', mgs: 'Invalid Date'});return;
	}else{
		date = "'" + date + "'";
	}

	// var query = "SELECT * FROM bd_cded_cde_pda.checklist " +
	// 			"join (SELECT Cod_Pos, Regional, Tienda FROM bd_cded_cde_pda.tiendas) as tienda " +
	// 			"ON ch_codPos = Cod_Pos " + 
	// 			"where cast(ch_log as date) = " + date + " order by Regional, Tienda";

	var query = "SELECT * FROM bd_cded_cde_pda.checklist AS checklist " +
				"JOIN (	SELECT ch_codPos as ch_codPos2, MAX(ch_log) as Max_ch_log FROM bd_cded_cde_pda.checklist where cast(ch_log as date) = " + date + " GROUP BY ch_codPos) d " +
				"ON ch_log = Max_ch_log and d.ch_codPos2 = checklist.ch_codPos " +
				"join (SELECT Cod_Pos, Regional, Tienda FROM bd_cded_cde_pda.tiendas) as tienda " +
				"ON ch_codPos = Cod_Pos " +
				"order by Regional, Tienda";
	 
	pool.query(query , function(err, rows, fields) {
		if (err){
			res.status(404).json(err);
			return;
		}		 		
		res.json(rows);
	});
	
});

// Consulta de lista de checklist:
// SELECT * FROM bd_cded_cde_pda.checklist 
// join (SELECT Cod_Pos, Regional, Tienda FROM bd_cded_cde_pda.tiendas) as cdss
// ON ch_codPos = Cod_Pos
// where cast(ch_log as date) = cast(now() as date)


module.exports = rutasCheck;