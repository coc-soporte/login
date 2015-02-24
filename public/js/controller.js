'use strict';

/**
 * @name lenninlasd@gmail.com 
 */
 angular.module('marcado')
 .controller('MarcadoCtrl', ['$scope', '$http', 'CdeList', '$location', function ($scope, $http, CdeList, $location) {

	$scope.dataLocal = JSON.parse(localStorage.getItem('admin')); 		
	if ($scope.dataLocal !== null) {
		$location.path('/registro/' + $scope.dataLocal.Tiendas_Cod_Pos); return;
	}

	var dataLocal;
	$scope.datas = CdeList.query();
	$scope.formulario = {};
	console.log($scope.datas);
	$scope.resetForms = function(){
		//console.log('asdflennin');
		$scope.alert = {};
		$scope.formulario.user = "";
		$scope.formulario.pass = "";
		$scope.keyModel = {};
		$scope.keyShow = 0;
		dataLocal = {};
	};

	$scope.resetForms();

	$scope.getDataloginRegistro = function(){
		var data = {};
		dataLocal.cod_pos = $scope.formulario.Tienda;
		dataLocal.email = data.email;
	};

	// Metodo que se ejecuta para el login
	$scope.setLoginForm = function(){
		console.log($scope.formulario);

		if (_.isUndefined($scope.formulario.Tienda)) {
			$scope.alert.cde = 1; 
			return;
		}
		$scope.alert.cde = 0;
		$scope.alert.datosMal = 0;
		$scope.alert.firsPass = 0;
		
		//console.log($scope.formulario);

		if ($scope.formulario.pass == 'Tigo2015') {
			$scope.alert.firsPass = 1;
			return;
		}

		$http.post(location.origin + '/login/checkUser/rac', $scope.formulario).
		  success(function(data, status, headers, config) {
			
			// Clona los datos del asesor 
			var infoRac = _.clone(data);
			console.log(infoRac);

			if (_.size(data) === 0) {
				
				$http.post(location.origin + '/login/checkUser/admin', $scope.formulario).		  			
					success(function(dataAdmin, status, headers, config) {
						if (_.size(dataAdmin) === 0){
							
							$http.post(location.origin + '/login/checkUser/coor', $scope.formulario).		  			
							success(function(dataCoor, status, headers, config) {

								if (_.size(dataCoor) === 0){
									$scope.alert.datosMal = 1;
								}else{
									dataCoor.rol = 'coor';
									localStorage.setItem('admin', JSON.stringify(dataCoor));
									var urlPath = '/registro/' + dataCoor.Tiendas_Cod_Pos;
									$location.path(urlPath); return;
								}
							});

						}else{
							dataAdmin.rol = 'admin';
							localStorage.setItem('admin', JSON.stringify(dataAdmin));
							var urlPath = '/registro/' + dataAdmin.Tiendas_Cod_Pos;
							$location.path(urlPath); return;
						}
					});
			}else{
				console.log(data.cod_pos);
								
				if (data.cod_pos !== $scope.formulario.Tienda) {
					var confirmar = confirm("Te estas registrando en un CDE diferente." +
											"\n Se registrará como apoyo." +
											"\n Preciona cancelar para cambiar de CDE.");
					if (!confirmar) {return}
					dataLocal.cod_pos_prestamo = data.cod_pos;
					dataLocal.cde_prestamo = _.findWhere($scope.datas, {Cod_Pos: data.cod_pos}).Tienda;


				};

				dataLocal.cod_pos = $scope.formulario.Tienda;
				dataLocal.cedula = data.cedula;
				dataLocal.email = data.email;
				dataLocal.rol = "asesor";
				dataLocal.in_out = $scope.formulario.inout;

				dataLocal.key = data.clave.slice(0, 8);

				$http.get(location.origin + '/admin/registro?codpos=' + dataLocal.cod_pos + '&cedula=' + dataLocal.cedula + '&maxregistro=1')
				.success(function(data, status, headers, config){

					var estado = dataLocal.in_out == 'in' ? 'Entrada' : 'Salida';
					var estadoOp = estado == 'Entrada' ? 'Salida' : 'Entrada'; // El estado invertido

					if (_.size(data) > 0 ){
						console.log(data[0].in_out); //// si son igulaes lanzar un alert
						if (data[0].in_out == dataLocal.in_out) {
							console.log("Ya te has registrado en el estado de '" + estado + "' por consistencia de la información debes seleccionar el estado de '" + estadoOp + "'");
							alert("Ya te has registrado en el estado de '" + estado + "' por consistencia de la información debes seleccionar el estado de '" + estadoOp + "'");
							return;
						}else{

							$scope.keyShow = 1;

							localStorage.setItem(infoRac.email, JSON.stringify(dataLocal));
							console.log(dataLocal);
							var url = "http://10.65.136.19:13013/cgi-bin/sendsms?to=" + infoRac.celular + "&username=foo&password=bar&text=" + dataLocal.key + "&from=log" + dataLocal.in_out;
							$http.get(url);
						}		  			

					}else{

						// Si el la primera entrada del rac, tiene que ser 'IN' y no 'Out'
						if ($scope.formulario.inout == 'out') {
							alert("El primer registro del dia debe ser de 'Entrada'");
							return;
						};

						$scope.keyShow = 1;

						localStorage.setItem(infoRac.email, JSON.stringify(dataLocal));
						console.log(dataLocal);
						var url = "http://10.65.136.19:13013/cgi-bin/sendsms?to=" + infoRac.celular + "&username=foo&password=bar&text=" + dataLocal.key + "&from=log" + dataLocal.in_out;
						$http.get(url);

					}
					
				})
				.error(function(data, status, headers, config) {});
				
			}		  	
		  }).
		  error(function(data, status, headers, config) {});
	}

	$scope.setLoginKey = function(){
		var dataKey = JSON.parse(localStorage.getItem(dataLocal.email));
		$scope.alert.key = 0;

		if (dataKey !== null && _.size(dataLocal) > 0 ){

			if ($scope.keyModel.key === dataKey.key) {
				$http.post(location.origin + '/login/setRegistro', dataLocal).
					success(function(data, status, headers, config) {
		 
						localStorage.removeItem(dataLocal.email);
						$scope.resetForms();

						$("#ingresoCorrecto").fadeIn("slow");
						$("#ingresoCorrecto").fadeOut(1500); // Sorry :(
					}).
					error(function(data, status, headers, config) {});
			}else{
				console.log("Clave incorrecta");
				$scope.alert.key = 1;
			}

		}else{
			console.log("no señor");
		}
	};

 }])

 .controller('crudRacCtrl', ['$scope', '$http', 'Rac', '$routeParams', '$location', function($scope, $http, Rac, $routeParams, $location){
	$scope.datosForm = {};
		
	$scope.codpos = $routeParams.codpos;
	//$scope.id = $routeParams.id;
	$scope.datas = Rac.query({codpos: $scope.codpos});
	//$scope.datas = Rac.query({codpos: $scope.codpos, userid: $scope.id});
	console.log($scope.datas);
	//function init(){
	$scope.dataLocal = JSON.parse(localStorage.getItem('admin')); 		
	if ($scope.dataLocal == null) {
		$location.path('/'); return;
	}
	//}

	function slowAlert() {
		$('#modal-rac').modal('hide');
	}

	$scope.editForm = function(userid){
		Rac.query({codpos: $scope.codpos, userid: userid}, function(data){
			$scope.datosForm = data[0]; 
		});
	};

	$scope.clearForm = function(){
		$scope.datosForm = {};
	};

	$scope.agregarUsuario = function(){
		console.log($scope.datosForm.id);
		
		if ($scope.datosForm.id) {
			console.log("hola");
			updateUsuario();
		}else{
			$scope.datosForm.cod_pos = $scope.codpos;

			$http.post(location.origin + '/admin/rac', $scope.datosForm).
			  success(function(data, status, headers, config) {
				if (_.size(data) > 0) {
					$scope.datosForm = {};  
					slowAlert();
					location.reload();
				};		  		
			  }).
			  error(function(data, status, headers, config) {});
		}
	};

	function updateUsuario(){
		var datosForm = _.clone($scope.datosForm);
		delete datosForm.log; delete datosForm.pass;
		$http.put(location.origin + '/admin/rac', datosForm).
		  // eliminar log de los datos y otros mas
		  success(function(data, status, headers, config) {
			if (_.size(data) > 0) {
				$scope.datosForm = {};  
				slowAlert();
				location.reload();
			};		  		
		  }).
		  error(function(data, status, headers, config) {});
	}

	$scope.deleteUser = function(){
		//console.log($scope.datosForm);
		if ($scope.datosForm.id) {
			$http.delete(location.origin + '/admin/rac/' + $scope.datosForm.id).
			  success(function(data, status, headers, config) {
				if (_.size(data) > 0) {
					$scope.datosForm = {};  
					slowAlert();
					location.reload();
				};		  		
			  }).
			  error(function(data, status, headers, config) {});
		}
	};

	$scope.cerrarSesion = function(){
		localStorage.clear();
		$location.path('/'); return;
	};



 }])
 .controller('registroCtrl', ['$scope', '$http', 'Registro', '$routeParams', '$location',
								function($scope, $http, Registro, $routeParams, $location){

	$scope.cerrarSesionAsesoresBtn = 1;
	$scope.alert = {insertadoAutomatico : 0};

	$scope.dataLocal = JSON.parse(localStorage.getItem('admin')); 		
	if ($scope.dataLocal == null) {
		$location.path('/'); return;
	}
	
	$scope.codpos = $routeParams.codpos;

	//$scope.registro = {}; 

	$scope.getRegistro = function(){
		var fecha = moment($scope.fecha).format('YYYY-MM-DD');

		Registro.query({codpos: $scope.codpos, date: fecha}, function(data){
			$scope.datosRegistro = data;

			if (_.size(data) && moment().format('YYYY-MM-DD') == fecha) {
				$scope.cerrarSesionAsesoresBtn = 0;
			}else{
				$scope.cerrarSesionAsesoresBtn = 1;
			}
			//console.log(data);
		});
	};

	$scope.cerrarSesionAsesores = function(){
		var confirmar = confirm("Se cerrará la cesión  de los asesores que la tienen abierta.");
		var success = 0;

		if (confirmar) {
			$http.get(location.origin + '/admin/getOpenRac?codpos=' + $scope.codpos).
				success(function(data, status, headers, config) {
					
					var dataSize = _.size(data);
					
					if (dataSize == 0) {return;}
					

					for (var i = 0; i < dataSize; i++) {
						var registro = {};
						registro.cedula = data[i].cedula;
						registro.cod_pos = data[i].Cod_Pos;
						registro.email = data[i].email;
						registro.key = $scope.dataLocal.Identificacion;
						registro.in_out = 'out';

						//console.log(data[i]);
						//console.log(registro);

						$http.post(location.origin + '/admin/registro', registro).
							success(function(data, status, headers, config) {
								console.log(data);
								
								if (data.affectedRows == 1) {
									success = success + 1;
									if (success == dataSize) {
										$scope.getRegistro();
										$("#ingresoCorrecto").fadeIn("slow");
										$("#ingresoCorrecto").fadeOut(3000);
									};
								};
							});
					};
				}).
				error(function(data, status, headers, config) {});
		}
	

	};

	$scope.cerrarSesion = function(){
		localStorage.clear();
		$location.path('/'); return;
	};

 }])

.directive('formCrud', function(){
	return{
		restrict: 'E',
		templateUrl: "views/form-crud.html"
	};
})

.directive('navBar', function(){
	return{
		restrict: 'E',
		templateUrl: "views/NavBar.html"
	};
})

.controller('cambiarpassCtrl', ['$scope', '$http', 'Rac', '$routeParams', '$location', function($scope, $http, Rac, $routeParams, $location){
	
	$scope.alert = {};
	$scope.formulario = {}
	$scope.alert.youShallNoPass = 0;
	$scope.alert.datosMal = 0;
	//console.log($scope.datas);

	$scope.changuePassForm = function(){

		$scope.alert.youShallNoPass = 0;
		$scope.alert.datosMal = 0;

		if ($scope.formulario.newpassagain == $scope.formulario.newpass) {

			var dataUp = {email: $scope.formulario.user,
						  pass: $scope.formulario.newpass};
			var dataGet = {user: $scope.formulario.user,
						  pass: $scope.formulario.oldpass};
			
			$http.post(location.origin + '/login/checkUser/' + $scope.formulario.tipouser, dataGet).
			  success(function(data, status, headers, config) {
				console.log(data);
				if (data) {
					$http.put(location.origin + '/admin/racUpDate/' + $scope.formulario.tipouser, dataUp).
					  success(function(data, status, headers, config) {
						if (data.affectedRows == 0) {
							$scope.alert.datosMal = 1
						
						}else if (data.affectedRows == 1) {
							$scope.formulario = {};
							$("#cambioCorrecto").fadeIn("slow");
							$("#cambioCorrecto").fadeOut(2500, function(){
								$location.path('/');
								$scope.$apply();				  	  			
							}); // Sorry :(
							
						}
					  }).
					  error(function(data, status, headers, config) {
						alert('Ocurrio un error, intenta de nuevo');
					  });
				}else{
					$scope.alert.datosMal = 1
				}
			  }).
			  error(function(data, status, headers, config) {
				alert('Ocurrio un error, intenta de nuevo');
			  });
			

		}else{
			$scope.alert.youShallNoPass = 1;
		}
		
	};

}])
.controller('resetpassCtrl', ['$scope', '$http', 'Rac', '$routeParams', '$location', 
									function($scope, $http, Rac, $routeParams, $location){
	$scope.alert = {};
	$scope.formulario = {}
	$scope.alert.datosMal = 0;
	$scope.alert.infoSMS = 0;
	$scope.mostrar = {formGenKey : 1};

	$scope.generateKey = function(){

		console.log($scope.formulario);

		var hash = CryptoJS.MD5(moment().toISOString());

		var dataUp = {email: $scope.formulario.email,
						pass: hash.toString().slice(0, 8)};

		$http.get(location.origin + '/admin/racUpDate/rac?email=' + $scope.formulario.email)
			.success(function(data, status, headers, config) {
				
				console.log(data[0]);
				
				var url = "http://10.65.136.19:13013/cgi-bin/sendsms?to=" + data[0].celular + "&username=foo&password=bar&text=" + dataUp.pass + "&from=reset pass";
				$http.get(url);

				localStorage.setItem(data[0].email + '-' + 'key', JSON.stringify(dataUp));

				$scope.mostrar.formGenKey = 0;
				$scope.alert.infoSMS = 1;

			  })
			  .error(function(data, status, headers, config) {});

	}

	$scope.resetPassForm = function(){

		var nameLocalStorage = $scope.formulario.email + '-' + 'key';
		var dataUp = JSON.parse(localStorage.getItem(nameLocalStorage));

		if (dataUp == null) {
			$location.path('/resetpass'); return;
		}

		if (dataUp.pass ==  $scope.formulario2.pass) {

			$http.put(location.origin + '/admin/racUpDate/' + $scope.formulario.tipouser, dataUp).
				success(function(data, status, headers, config) {
					if (data.affectedRows == 0) {

						$scope.alert.datosMal = 1;
					
					}else if (data.affectedRows == 1) {

						$scope.formulario = {};
						$scope.formulario2 = {};
						localStorage.removeItem(nameLocalStorage);

						$("#cambioCorrecto").fadeIn("slow");
						$("#cambioCorrecto").fadeOut(5000, function(){
							$location.path('/');
							$scope.$apply();  	  			
						}); // Sorry :(
					}
				}).
				error(function(data, status, headers, config) {
					alert('Ocurrio un error, intenta de nuevo');
				});
		}
		
	};	
}]);

