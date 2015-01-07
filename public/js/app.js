'use strict';

/**
 * @ngdoc overview
 * @name appApp
 * @description
 * # appApp
 *
 * Main module of the application.
 */
angular
	.module('marcado', [
		'components',
		'ngRoute',
	])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/marcado.html',
				controller: 'MarcadoCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
	});