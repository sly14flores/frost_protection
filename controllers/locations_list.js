var app = angular.module('locationsList',['account-module','app-module']);

app.controller('locationsListCtrl',function($scope,app) {
	
	$scope.app = app;
	
	$scope.app.data($scope);

	$scope.app.list($scope);
	


});