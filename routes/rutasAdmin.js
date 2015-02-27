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
		  	if (err) {res.status(400).json({status: '400'});return;}
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
				if (err){
					res.status(400).json({status: '400'});
					//console.log(err);
					return;
				}

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

rutasAdmin.route('/rac/:id')
.delete(function(req, res){
	var racId = req.params.id;

	pool.query('DELETE FROM login.asesores where id = ' + racId, function(err, rows, fields) {
		if (err){res.status(400).json({status: '400'});return;}
		res.json(rows);
	});
});

rutasAdmin.route('/registro')
.get(function(req, res){

	var Cod_Pos = req.query.codpos;
	var date = req.query.date;
	var cedula = req.query.cedula;
	var maxRegistro = req.query.maxregistro;

	if (_.size(Cod_Pos) > 0) {

		// Si no hay fecha, la fecha por defecto será la actual
		if (_.size(date) > 0) {date = "'" + date + "'"}else{date = "curdate()"}
		
		if (maxRegistro == 1) {
			var query = "SELECT * FROM login.registro where cod_Pos = '" + Cod_Pos + "' and cedula = " + cedula + " and cast(log as date) = current_date order by log desc limit 1"
		}else{
			//var query = "SELECT * FROM login.registro where cod_pos = '" + Cod_Pos + "' and cast(log as date) = " + date;
		
			var query = "SELECT * FROM login.registro as reg " + 
						"join (select cedula as cedula_, usuario, nombre from login.asesores) as ase " +
						"on reg.cedula = ase.cedula_ " +
						"where  reg.cod_pos = " + Cod_Pos + " and cast(reg.log as date) = " + date + " " +
						"order by reg.log";
		}		

		pool.query(query, function(err, rows, fields) {
		  	if (err) {res.status(400).json(err);return;}
		  	res.json(rows);
		});

	}else{
		res.status(404).json({status: '404'});
	}
})
.post(function(req, res){
	var post = req.body;
	//console.log(post);
	if (_.size(post) > 0) {
			
			var query = pool.query('INSERT INTO login.registro SET ?', post , function(err, rows, fields) {
				if (err){
					console.log(err);
					res.status(400).json({status: '400'});
					//console.log(err);
					return;
				}

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
		  	if (err) {res.status(400).json({status: '400'});return;}
		  	res.json(rows);
		});
	}else if (tipoUsuario === "coor") {
		var query = "SELECT * FROM bd_cded_cde_pda.coordinadores_db where Correo = '" + email + "'";
		pool.query(query, function(err, rows, fields) {
		  	if (err) {res.status(400).json({status: '400'});return;}
		  	res.json(rows);
		});

	}else if (tipoUsuario === "admin") {
		var query = "SELECT * FROM bd_cded_cde_pda.administradores where Correo = '" + email + "'";
		pool.query(query, function(err, rows, fields) {
		  	if (err) {res.status(400).json({status: '400'});return;}
		  	res.json(rows);
		});
	}
})
.put(function(req, res){
	var put = req.body;
	var tipoUsuario = req.params.user;
	//console.log(put);
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

rutasAdmin.route('/getOpenRac')
.get(function(req, res){

	var codpos = req.query.codpos;

	if (codpos) {

		var query = "SELECT id, PRI.cedula, PRI.log, Cod_Pos, PRI.email, PRI.key, rol, in_out, cod_pos_prestamo, cde_prestamo FROM login.registro AS PRI "
						+ "JOIN (SELECT cedula, max(log) log, email FROM login.registro "
						+ "where cod_Pos = " + codpos + " and cedula is not NULL "
						+ "and cast(log as date) = curdate() "
						+ "group by cedula, email) AS Q "
					+ "ON PRI.cedula = q.cedula and PRI.log = Q.log "
					+ "where in_out = 'in'";
		pool.query(query, function(err, rows, fields) {
		  	if (err) {res.status(400).json({status: '400'});return;}
		  	res.json(rows);
		});
	}else{
		res.status(400).json({status: '400'});
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