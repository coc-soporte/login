'use strict';

/**
 * @name lenninlasd@gmail.com 
 */
 angular.module('marcado')
 .controller('MarcadoCtrl', ['$scope', '$http', function ($scope, $http) {

 	$scope.alert = {};

 	$http.get('json/asesor.json').success(function(data) {
		$scope.asesores = data;
		console.log(data);
	});

	$scope.setLoginForm = function(){
		if (_.size($scope.formulario.cde) === 0) {
			$scope.alert.cde = 1; 
			return;
		}
		$scope.alert.cde = 0; 
		console.log(_.size($scope.formulario.cde));
		console.log($scope.formulario);
	}


 	
 }]);
