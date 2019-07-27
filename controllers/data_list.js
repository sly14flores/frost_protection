var app = angular.module('dataList',['account-module','app-module','notifications-module']);

app.controller('dataListCtrl',function($scope,$http,app,$interval) {

	$scope.module = {
		id: 'data_list',
		privileges: {

		}
	};

	$scope.app = app;
	
	$scope.app.data($scope);

	$http({
		url: 'handlers/locations.php',
		method: 'GET',			
	}).then(function success(response) {
		
		$scope.locations = response.data;
		
	}, function error(response) {
		
	});	
	
});

app.filter('pagination', function() {
	  return function(input, currentPage, pageSize) {
	    if(angular.isArray(input)) {
	      var start = (currentPage-1)*pageSize;
	      var end = currentPage*pageSize;
	      return input.slice(start, end);
	    }
	  };
});
