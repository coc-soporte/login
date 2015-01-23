'use strict';

/**
 * @name lenninlasd@gmail.com 
 */

 angular.module('marcado')
 .controller('CheckCtrl', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {

	$scope.datas = [];

	function inicio(){

		$scope.datas = JSON.parse(localStorage.getItem("ipList"));
		var inicio = localStorage.getItem("inicio");
		// Si existe el registro en el localStorage, el registro se actualizará, y luego se actualiza el mysql
		// Si no se tomara la info de la BD de MySql, se almacenará en el local

		if (inicio == 1) {return}
		
		if ($scope.datas !== null) {

			localStorage.setItem("inicio", 1);

			$http.get('http://10.66.6.241:82/code-dev/analytics/getIPS').success(function(data) {				
				var stringifyData = JSON.stringify(data);				
				localStorage.setItem("ipList", stringifyData);
				$http.post('http://10.66.6.241:82/code-dev/analytics/setIPSmysql', data);
			});
		}else{
			$http.get('http://10.66.6.241:82/code-dev/analytics/getIPSmysql').success(function(data) {
				$scope.datas = data;
				localStorage.setItem("ipList", JSON.stringify(data));
			});
		}
	}
	inicio();

	//--------- Valida la Sesion --------------------
	var checkSession = JSON.parse(localStorage.getItem("checkData"));
	$scope.enviado = localStorage.getItem("enviado");

	if (checkSession !== null) {

		$scope.loginData = checkSession;

		$scope.session = false;			

	}else{
		$scope.session = true;
	}
	console.log($scope.session);
	//***********************************************************************
	$scope.buttonClass = 'btn-default';
	$scope.buttonClass2 = 'btn-default';
	$scope.showForm = 1;
	$scope.alert = {};
	$scope.alert.cde = 0;
	$scope.alert.datosMal = 0;
	$scope.checkData = {};
	
	$scope.otraData = {};
	$scope.otraDataCopia = {};

	$scope.checkDataCopia = {};
	$scope.disableBotonSubmit = 0;
	$scope.disableBotonSubmit2 = 0;
	$scope.showBackdrop = 1;

	$scope.asesores = {
		eventos: [{label: "Compensatorios"},
				  {label:"Incapacitados"}, 
				  {label: "Prestados"},
				  {label:"Ausentes"}, 
				  {label:"Entrenamiento"},
				  {label:"Capacitacion"}, 
				  {label: "Vacio Lab"},
				  {label: "Vacaciones"},
				  {label: "Venta externa"},
				  {label: "Retiros"}, 
				  {label:"AseApoyos"}],
		
		modelo: [{label: "Orientador"},
				 {label:"L1"},
				 {label: "L2"},
				 {label: "DM"},
				 {label: "GB"},
				 {label: "LZ"}],
		
		distribucion: [{label: "Apertura"},
					   {label:"Seg Turno"},
					   {label:"Ter Turno"}]
	};
	
	$scope.asesores.atencionDist = 0;
	$scope.asesores.modeloManual = 0;
	var eventualidades = 0;

	//****************** Obtenemos el objeto de checklist, y eliminamos la id y el log 
	//****************** y luego lo copiamos para validar si se realizaron cambios.
	$scope.getCheckListId = function(){

		if ($scope.session == true) {$location.path('/'); return;}

		$http.get('http://10.66.6.241:3000/check/getCheckListCDEid/' 
								   + $scope.loginData.ACC_PFKSTROFICINA + '/' + $scope.id).
			success(function(data, status, headers, config) {
				console.log(data);

				if (_.size(data) > 0) {
					$scope.checkData = data[0];
					delete  $scope.checkData.cd_id; delete  $scope.checkData.ch_log;
					$scope.checkDataCopia = _.clone($scope.checkData);

					$scope.otraData =  JSON.parse($scope.checkData.ch_otro);
					$scope.otraDataCopia =  _.clone($scope.otraData);

				}else{					
					$location.path('/');
				}
			}).
			error(function(data, status, headers, config) {
				$location.reload();
			});
	};

	//***** DATA ******
	$scope.id = parseInt(Number($routeParams.id));
	
	if ($scope.id) {
		limpiarValores();
		$scope.getCheckListId();

	}else{
		$location.path('/');
		limpiarValores();
		$scope.showBackdrop = 0;
	}

	 
	function limpiarValores(){
		$scope.checkData.ch_contratados = 0;

		$scope.checkData.ch_compensatorio = 0;
		$scope.checkData.ch_incapacitados = 0;
		$scope.checkData.ch_prestados = 0;
		$scope.checkData.ch_ausentes = 0;
		$scope.checkData.ch_entrenamiento = 0;
		$scope.checkData.ch_capacitacion = 0;
		$scope.checkData.ch_vacioLab = 0;
		$scope.checkData.ch_vacaciones = 0;
		$scope.checkData.ch_ventaExterna = 0;
		$scope.checkData.ch_retiros = 0;
		$scope.checkData.ch_aseApoyos = 0;

		$scope.checkData.ch_orientador = 0;
		$scope.checkData.ch_PL = 0;
		$scope.checkData.ch_SL = 0;
		$scope.checkData.ch_DM = 0;
		$scope.checkData.ch_GB = 0;
		$scope.checkData.ch_LZ = 0;

		$scope.checkData.ch_apertura = 0;
		$scope.checkData.ch_segTurno = 0;
		$scope.checkData.ch_terTurno = 0;

		$scope.checkData.ch_observaciones = "";
	}

	//***********************************************************************

	$scope.logOut = function(){
		localStorage.removeItem("checkData");
		localStorage.removeItem("inicio");
		window.location.reload();
	};

	$scope.setLoginForm = function(){
		//console.log($scope.formulario);

		if (!$scope.formulario.cde) {
			$scope.alert.cde = 1;
			$scope.alert.datosMal = 0;
			return;
		}else{
			$scope.alert.cde = 0;
		}
		$scope.disableBotonSubmit = 1;

		$http.post('http://10.66.6.241:82/code-dev/analytics/logingChecklist', $scope.formulario).
			success(function(data, status, headers, config) {

				if (typeof(data) === "object") {
					$scope.loginData = data;
					localStorage.setItem("checkData", JSON.stringify(data));
					$scope.session = false;

					$location.path('/lista/0');
					//console.log($scope.loginData);

				}else{
					console.log(typeof(data));
					$scope.alert.datosMal = 1;
					$scope.disableBotonSubmit = 0;
				}
			}).
			error(function(data, status, headers, config) {
				alert("Ocurrió un problema, por favor intenta de nuevo.");
				$scope.disableBotonSubmit = 0;
			});
	};

	$scope.eventos = function(num){
		num = num || 0;
		if (num) {$scope.showForm = num; console.log($scope.showForm);}

		eventualidades = $scope.checkData.ch_compensatorio
						+ $scope.checkData.ch_incapacitados
						+ $scope.checkData.ch_prestados
						+ $scope.checkData.ch_ausentes
						+ $scope.checkData.ch_entrenamiento
						+ $scope.checkData.ch_capacitacion
						+ $scope.checkData.ch_vacioLab
						+ $scope.checkData.ch_vacaciones
						+ $scope.checkData.ch_ventaExterna
						+ $scope.checkData.ch_retiros;

		$scope.asesores.enCDE = $scope.checkData.ch_contratados + $scope.checkData.ch_aseApoyos - eventualidades;
		
		$scope.asesores.enAtencion = $scope.checkData.ch_PL + $scope.checkData.ch_SL;

		$scope.asesores.modeloManual =	$scope.checkData.ch_orientador
										+ $scope.checkData.ch_PL
										+ $scope.checkData.ch_SL
										+ $scope.checkData.ch_DM
										+ $scope.checkData.ch_GB
										+ $scope.checkData.ch_LZ;
	};

	$scope.modeloFunction = function(){
		$scope.eventos();

		if ($scope.asesores.enCDE === $scope.asesores.modeloManual) {
			$scope.buttonClass = 'btn-success';
			return false;
		}else{
			$scope.buttonClass = 'btn-default';
			return true;
		}
	};

	$scope.distribucionFunction = function(){
		$scope.eventos();

		$scope.asesores.atencionDist = $scope.checkData.ch_apertura 
									   + $scope.checkData.ch_segTurno + $scope.checkData.ch_terTurno;

		if ($scope.asesores.enAtencion === $scope.asesores.atencionDist 
			&& $scope.asesores.enCDE === $scope.asesores.modeloManual 
			&& $scope.asesores.atencionDist > 0
			&& (!_.isEqual($scope.checkDataCopia, $scope.checkData)	|| 
				!_.isEqual($scope.otraDataCopia, $scope.otraData)) ){ 			
			
			$scope.buttonClass2 = 'btn-success';
			return false;
		}else{
			$scope.buttonClass2 = 'btn-default';
			return true;
		}
	};

	$scope.setChecklistForm = function(){
		
		var checkData = $scope.checkData;
		
		checkData.ch_codPos = $scope.loginData.ACC_PFKSTROFICINA;
		checkData.ch_usuario = $scope.loginData.ACC_PFKSTRUSUARIO;
		checkData.ch_nombre  = $scope.loginData.USU_SDSTRNOMBRE;

		checkData.ch_otro = JSON.stringify($scope.otraData);
		$scope.disableBotonSubmit2 = 1;

	    console.log(checkData);

	   	$http.post('http://10.66.6.241:82/code-dev/analytics/insertChecklist', checkData).
			success(function(data, status, headers, config) {
				$scope.enviado = 1;
				$scope.disableBotonSubmit2 = 0;
				localStorage.setItem("enviado", 1);
				$location.path('/lista/0');
			}).
			error(function(data, status, headers, config) {
				alert("Ocurrió un error, por favor intenta de nuevo");
				$scope.disableBotonSubmit2 = 0;
			});

	};

	$scope.eventos();

 }]);
