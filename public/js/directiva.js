'use strict';

angular.module('components', [])
	.directive('lsDatalist', function($document){

		function link(scope, element, attrs){

			scope.busqueda = "";
			scope.seleccionado = {};
			scope.formulario = {};
			scope.placeholder = attrs.placeholder;
			scope.showSeleccion = true;
			scope.focus = false;
			scope.nombreDatalist = attrs.option;

			//console.log(showSeleccion);
			scope.seleccionar = function(seleccion){

				scope.seleccionado = seleccion;
				//console.log(scope.seleccionado);
				scope[attrs.lsmodel][attrs.option] = seleccion[attrs.value];

				scope.busqueda = "";
				scope.showSeleccion = _.isEmpty(scope.seleccionado);
				scope.focus = false;
				scope.placeholder = "";
			};
			scope.desSeleccionar = function(){
				scope.seleccionado = {};
				scope.busqueda = "";
				delete scope[attrs.lsmodel][attrs.option];
				scope.showSeleccion = _.isEmpty(scope.seleccionado);
				scope.placeholder = attrs.placeholder;
			};

			element.bind('click', function(e) {
		        e.stopPropagation();
		    });

			$document.bind('click', function() {				
				//console.log("documenttt");
	        	scope.$apply(function(){
	        		scope.focus = false;
	        	});
	      	});
		}
		return{
			restrict: 'E',			
			templateUrl: "components/views/datalist.html",
			link: link
		};	
	});

