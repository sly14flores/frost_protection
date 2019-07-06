var app = angular.module('dashboardList',['account-module','dashboard-module','notifications-module']);

app.controller('dashboardListCtrl',function($scope,$http,dashboard,$interval) {

	$scope.module = {
		id: 'dashboard',
		privileges: {

		}
	};

	$scope.dashboard = dashboard;
	
	$scope.dashboard.data($scope);

	
});
