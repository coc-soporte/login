var express = require('express');
var mysql = require('mysql');
var _ = require("underscore");

var rutasAdmin = express.Router();

//----------------------------------------------
var pool = mysql.createPool({
  connectionLimit : 100,
  host     : '10.66.6.240',
  user     : 'ricardo',
  password : 'ricardo'
});
//----------------------------------------------

rutasAdmin.route('/rac')
.get(function(req, res){

	var Cod_Pos = req.query.codpos;
	var userId = req.query.userid;
	//console.log(_.size(userId));
	if (_.size(Cod_Pos) > 0) {

		if (_.size(userId) > 0) {
			var query = "SELECT * FROM login.asesores where Cod_Pos = '" + Cod_Pos + "' and id = " + userId + " and estado = 'activo'";
		}else{
			var query = "SELECT * FROM login.asesores where Cod_Pos = '" + Cod_Pos + "' and estado = 'activo'";
		}
		
		pool.query(query, function(err, rows, fields) {
		  	if (err) throw err;
		  	res.json(rows);
		});
	}else{
		res.status(404).json({status: '404'});
	}
})
.post(function(req, res){
	var post = req.body;
	//console.log(_.size(post));

	if (_.size(post) > 0) {
			var query = pool.query('INSERT INTO login.asesores SET ?', post , function(err, rows, fields) {
			if (err){res.status(400).json({status: '400'});return;}
				res.json(rows);
			});
	}else{
		res.status(404).json({status: '404'});
	}

})
.put(function(req, res){
	var put = req.body;

	var query = pool.query('UPDATE login.asesores SET ? WHERE id = ?', [put, put.id] , function(err, rows, fields) {
		if (err){res.status(400).json({status: '400'});return;}
		res.json(rows);
	});

	//console.log(put);
});

rutasAdmin.route('/registro')
.get(function(req, res){

	var Cod_Pos = req.query.codpos;
	var date = req.query.date;

	if (_.size(Cod_Pos) > 0) {

		// Si no hay fecha, la fecha por defecto será la actual
		if (_.size(date) > 0) {date = "'" + date + "'"}else{date = "curdate()"}
		
		var query = "SELECT * FROM login.registro where cod_pos = '" + Cod_Pos + "' and cast(log as date) = " + date;
		pool.query(query, function(err, rows, fields) {
		  	if (err) throw err;
		  	res.json(rows);
		});

	}else{
		res.status(404).json({status: '404'});
	}
});

rutasAdmin.route('/racUpDate/:user')
.get(function(req, res){
	
	var tipoUsuario = req.params.user;
	var email = req.query.email;

	if (tipoUsuario === "rac") {

		var query = "SELECT * FROM login.asesores where email = '" + email + "'";
		pool.query(query, function(err, rows, fields) {
		  	if (err) throw err;
		  	res.json(rows);
		});
	}
})
.put(function(req, res){
	var put = req.body;
	var tipoUsuario = req.params.user;
	console.log(put);
	if (tipoUsuario === "rac") {
			pool.query('UPDATE login.asesores SET ? WHERE email = ?', [put, put.email] , 
				function(err, rows, fields) {
					if (err){res.status(400).json({status: '400'});return;}
					res.json(rows);
				});

	}else if (tipoUsuario === "coor") {
		var correo = {};
		correo.pass = put.pass;

		pool.query('UPDATE bd_cded_cde_pda.coordinadores_db SET ? WHERE Correo = ?', [correo, put.email] , 
		function(err, rows, fields) {
			if (err){res.status(400).json({status: '400'});return;}
			res.json(rows);
		});
	}else if (tipoUsuario === "admin") {
		var correo = {};
		correo.pass = put.pass;

		pool.query('UPDATE bd_cded_cde_pda.administradores SET ? WHERE Correo = ?', [correo, put.email] , function(err, rows, fields) {
			if (err){res.status(400).json({status: '400'});return;}
			res.json(rows);
		});
	}else{
		res.status(400).json({status: '400'});return;
	}

	
});
// rutasAdmin.route('/coorUpDate')
// .put(function(req, res){
// 	var put = req.body;
// 	var correo = {};
// 	correo.pass = put.pass;

// 	pool.query('UPDATE bd_cded_cde_pda.coordinadores_db SET ? WHERE Correo = ?', [correo, put.email] , 
// 		function(err, rows, fields) {
// 			if (err){res.status(400).json({status: '400'});return;}
// 			res.json(rows);
// 		});
// });
// rutasAdmin.route('/adminUpDate')
// .put(function(req, res){
// 	var put = req.body;
// 	var correo = {};
// 	correo.pass = put.pass;

// 	var query = pool.query('UPDATE bd_cded_cde_pda.administradores SET ? WHERE Correo = ?', [correo, put.email] , function(err, rows, fields) {
// 		if (err){res.status(400).json({status: '400'});return;}
// 		res.json(rows);
// 	});
// });

module.exports = rutasAdmin;