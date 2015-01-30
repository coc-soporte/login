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
		'ngRoute',
		'components',		
	])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/check.html',
				controller: 'CheckCtrl'
			})
			.when('/:id', {
				templateUrl: 'views/check.html',
				controller: 'CheckCtrl'
			})
			.when('/lista/:paginacion', {
				templateUrl: 'views/lista.html'
			})
			.when('/cambiarpass', {
				templateUrl: 'views/cambiarpass.html'
			})
			.when('/ie/:ie', {
				templateUrl: 'views/ie.html'
			})
			.when('/checklist/8deedcd3508f2d84eafb4317e4dfb1ee', {
				templateUrl: 'views/socket.html',
				controller: 'socketCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
	})
	.config(function($httpProvider) {
      //Enable cross domain calls
      $httpProvider.defaults.useXDomain = true;

      //Remove the header used to identify ajax call  that would prevent CORS from working
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });