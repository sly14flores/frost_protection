var app = angular.module('dashboardList',['account-module','dashboard-module','notifications-module']);

app.controller('dashboardListCtrl',function($scope,$http,dashboard,$interval) {

	$scope.module = {
		id: 'dashboard',
		privileges: {

		}
	};

	$scope.dashboard = dashboard;
	
	$scope.dashboard.data($scope);

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
