'use strict';

/**
 * @name lenninlasd@gmail.com 
 */
 angular.module('marcado')
 .controller('MarcadoCtrl', ['$scope', '$http', 'CdeList', function ($scope, $http, CdeList) {

 	$scope.alert = {};
 	$scope.formulario = {};

	$scope.datas = CdeList.query();
	//console.log($scope.datas);

	$scope.setLoginForm = function(){
		console.log($scope.formulario);

		if (_.isUndefined($scope.formulario.Tienda)) {
			$scope.alert.cde = 1; 
			return;
		}
		$scope.alert.cde = 0;
	}
 }])
 .controller('testServiceCtrl', ['$scope', 'Phone', function($scope, Phone){
 	 $scope.phones = Phone.query();
 	 console.log($scope.phones);
 }]);
