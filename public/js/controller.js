'use strict';

/**
 * @name lenninlasd@gmail.com 
 */
 angular.module('marcado')
 .controller('MarcadoCtrl', ['$scope', '$http', function ($scope, $http) {

 	$http.get('json/asesor.json').success(function(data) {
		$scope.asesores = data;
		console.log(data);
	});

	$scope.setForm = function(){
		console.log($scope);
	}


 	
 }]);
