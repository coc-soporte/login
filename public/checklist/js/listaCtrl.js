'use strict';

/**
 * @name lenninlasd@gmail.com 
 */
 angular.module('marcado')
 .controller('ListaCtrl', ['$scope', '$http', '$location', '$routeParams' ,function ($scope, $http, $location, $routeParams) {

 	$scope.listas = [];
 	$scope.spin = 1;
 	$scope.sinRegistros = 0;
 	$scope.disablePaginacion = 1;
 	$scope.disablePaginacionNext = 1;
 	$scope.paginacion = parseInt($routeParams.paginacion);
 		//--------- Valida la Sesion --------------------
 	
	var checkSession = JSON.parse(localStorage.getItem("checkData"));

	if (checkSession !== null ) {

		$scope.loginData = checkSession;		
				
				//$http.post('http://10.66.6.241:3000/check/getCheckListCDE/' + $scope.paginacion, $scope.loginData).
				$http.get('http://10.66.6.241:3000/check/checkListCDE/?paginacion=' + $scope.paginacion + '&codpos=' + $scope.loginData.ACC_PFKSTROFICINA).
					success(function(data, status, headers, config) {
						console.log(data);
						$scope.listas = data;
						$scope.spin = 0;
						$scope.disablePaginacion = 0;
						$scope.disablePaginacionNext = 0;
						// Varifica si se realizó el checkList
						if ($scope.listas.length) {
							if ($scope.listas[0]['ch_log'].slice(0, 10) == moment().format("YYYY-MM-DD") && $scope.listas[0]['ch_estado'] >= 1) {
								localStorage.setItem("enviado", 1);
							}else{
								localStorage.setItem("enviado", 0);
							}
						}else if ($scope.paginacion == 0) {
							$scope.disablePaginacion = 1;
							$scope.sinRegistros = 1;
						
						}else if ($scope.paginacion > 0) {
							$scope.disablePaginacionNext = 1;
						};
					}).
					error(function(data, status, headers, config) {
						console.log("error con lista de checklist: do something");

						    if (confirm("Ocurrio un error, presiona 'OK' para recargar.") == true) {
						        location.reload();
						    }
						//
					});

	}else{
		$location.path('/');
	}

	$scope.JSONparse = function(obj){
		return JSON.parse(obj);
	};


	$scope.logOut = function(){
		localStorage.removeItem("checkData");
		localStorage.removeItem("inicio");
		window.location.reload();
	};

	$scope.setPaginacionSiguiente = function(){
		$scope.paginacion = $scope.paginacion + 1;
		$location.path('/lista/' + $scope.paginacion);
	};
	$scope.setPaginacionAnterior  = function(){		
		if ($scope.paginacion > 0) {
			$scope.paginacion = $scope.paginacion - 1;
		}else {
			$scope.paginacion = 0;
		}
		$location.path('/lista/' + $scope.paginacion);
	};

 }]);
