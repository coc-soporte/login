var express = require('express');
var mysql = require('mysql');
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
})
.post(function(req, res){
	// var post = req.body;

	// if (_.size(post) > 0) {
	// 		var query = pool.query('INSERT INTO login.asesores SET ?', post , function(err, rows, fields) {
	// 			if (err){res.status(400).json({status: '400'});return;}
	// 			res.json(rows);
	// 		});
	// }else{
	// 	res.status(404).json({status: '404'});
	// }

});

module.exports = rutasCheck;