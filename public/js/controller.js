'use strict';

/**
 * @name lenninlasd@gmail.com 
 */
 angular.module('marcado')
 .controller('MarcadoCtrl', ['$scope', '$http', 'CdeList', function ($scope, $http, CdeList) {


	var dataLocal;
	$scope.datas = CdeList.query();

	$scope.resetForms = function(){
		$scope.alert = {};
		$scope.formulario = {};
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

	$scope.setLoginForm = function(){
		console.log($scope.formulario);

		if (_.isUndefined($scope.formulario.Tienda)) {
			$scope.alert.cde = 1; 
			return;
		}
		$scope.alert.cde = 0;
		$scope.alert.datosMal = 0;

		$http.post(location.origin + '/login/checkUser', $scope.formulario).
		  success(function(data, status, headers, config) {
		  	if (_.size(data) === 0) {
		  		$scope.alert.datosMal = 1;
		  	}else{
		  		$scope.keyShow = 1;
		  		dataLocal.cod_pos = $scope.formulario.Tienda;
				dataLocal.email = data.email;
				dataLocal.rol = "asesor";
				dataLocal.inout = "in";
				dataLocal.key = data.clave.slice(0, 8);
			
		  		localStorage.setItem(data.email, JSON.stringify(dataLocal));
		  		console.log($scope.keyShow);
		  		var url = "http://10.65.136.19:13013/cgi-bin/sendsms?to=" + data.celular + "&username=foo&password=bar&text=" + dataLocal.key + "&from=log" + dataLocal.inout;
		  		$http.get(url);
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
		  	  			console.log(_.size(data));
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
 // .controller('crudRacCtrl', ['$scope', '$http', 'Rac', '$routeParams', function($scope, $http, Rac, $routeParams){
 // 		$scope.codpos = $routeParams.codpos;
 // 		$scope.datas = Rac.query({codpos: $scope.codpos});
 // }])
 .controller('crudRacCtrl', ['$scope', '$http', 'Rac', '$routeParams', function($scope, $http, Rac, $routeParams){
 	$scope.datosForm = {};
 		
 	$scope.codpos = $routeParams.codpos;
 	//$scope.id = $routeParams.id;
 	$scope.datas = Rac.query({codpos: $scope.codpos});
 	//$scope.datas = Rac.query({codpos: $scope.codpos, userid: $scope.id});
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



 }])
 .controller('registroCtrl', ['$scope', '$http', 'Registro', function($scope, $http, Rac){
 	
 }])

.directive('formCrud', function(){
	return{
		restrict: 'E',
		templateUrl: "views/form-crud.html"
	};
});

