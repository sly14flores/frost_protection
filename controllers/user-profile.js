var app = angular.module('profile',['account-module','app-module','ngRoute']);

app.controller('profileCtrl',function($http,$scope,app) {
	
	$scope.app = app;
	
	$scope.app.data($scope);
	
	$scope.app.startup($scope);	
	
	$scope.module = {
		id: 'accounts',
		privileges: {
			show: 1,
			add: 2,
			edit: 3,
			delete: 4,
		}
	};
	
	$http({
		url: 'handlers/locations.php',
		method: 'GET',			
	}).then(function success(response) {
		
		$scope.locations = response.data;
		
	}, function error(response) {
		
	});	
	
});