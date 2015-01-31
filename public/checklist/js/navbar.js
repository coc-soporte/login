'use strict';

angular.module('AppNavbar', [])
	.directive('lsHeader', function(){

		function link(scope, element, attrs){
			
			scope.compararURL = function(url){

				if (location.hash === url) {
					return true;
				}else{
					return false;
				}
			}
		};
		return{
			restrict: 'E',			
			templateUrl: "views/navbar.html",
			link: link
		};	
	})
	.controller('header1', ['$scope','$location', function($scope){

		
	}]);

