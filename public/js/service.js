'use strict';

angular.module('loginServices', ['ngResource'])
.factory('Phone', ['$resource', function($resource){
    return $resource('json/:asesorId.json', {}, {
      query: {method:'GET', params:{asesorId:'asesor'}, isArray:true}
    });
  }])

.factory('CdeList', ['$resource', function($resource){
    return $resource('http://10.66.6.241:3000/login/cdelist', {}, {
      query: {method:'GET', isArray:true}
    });
}])

.factory('Rac', ['$resource', function($resource){
	return $resource('http://10.66.6.241:3000/admin/rac', {}, {
      query: {method:'GET', params:{}, isArray:true}
    });
}]);