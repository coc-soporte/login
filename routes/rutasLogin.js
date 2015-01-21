var express = require('express');
var mysql = require('mysql');

var rutasLogin = express.Router();

//----------------------------------------------
var pool = mysql.createPool({
  connectionLimit : 100,
  host     : '10.66.6.240',
  user     : 'ricardo',
  password : 'ricardo'
});
//----------------------------------------------

rutasLogin.route('/')
.get(function(req, res){

	pool.query("SELECT * FROM gtr.infocde WHERE REGION = 'CENTRO'", function(err, rows, fields) {
	  	if (err) throw err;
	  	res.json(rows);
	});
});

rutasLogin.route('/cdelist')
.get(function(req, res){

	var query = "SELECT Cod_Pos, Regional, Ciudad, Tienda FROM bd_cded_cde_pda.tiendas";
	
	pool.query(query, function(err, rows, fields) {
	  	if (err) throw err;
	  	res.json(rows);
	});
});

rutasLogin.route('/checkUser/:user')
.post(function(req, res){

	//console.log(req.body);
	var email = req.body.user;
	var pass = req.body.pass;
	var tipoUsuario = req.params.user;

	console.log(tipoUsuario);

	if (tipoUsuario === "rac") {
		var query = "SELECT *, MD5(now()) as clave FROM login.asesores where email = '" + 
					email + "' and pass = '" + pass + "'";
	}else if(tipoUsuario === "admin"){
		var query = "SELECT * FROM bd_cded_cde_pda.administradores where Correo = '" + 
					email + "' and pass = '" + pass + "'";
	}else if(tipoUsuario === "coor"){
		var query = "SELECT * FROM bd_cded_cde_pda.coordinadores_db where Correo = '" + 
					email + "' and pass = '" + pass + "'";
	}else{
		if (err){res.status(400).json({status: '400'});return;}
	}

	pool.query(query, function(err, rows, fields) {
	  	if (err){res.status(400).json({status: '400'});return;}
	  	res.json(rows[0]);
	});
});

rutasLogin.route('/setRegistro')
.post(function(req, res){

	//var query = "SELECT Cod_Pos, Regional, Ciudad, Tienda FROM bd_cded_cde_pda.tiendas";
	var post = req.body;
	
	var query = pool.query('INSERT INTO login.registro SET ?', post , function(err, rows, fields) {
	  	if (err) throw err;
	  	res.json(rows);
	});

	//console.log(query.sql); //

});


module.exports = rutasLogin;