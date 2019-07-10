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
