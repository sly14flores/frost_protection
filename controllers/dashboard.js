var app = angular.module('dashboard',['account-module','dashboard-module','notifications-module']);

app.controller('dashboardCtrl',function($scope,$http,dashboard,$interval) {

	$scope.module = {
		id: 'dashboard',
		privileges: {

		}
	};

	$scope.dashboard = dashboard;
	
	$scope.dashboard.data($scope);

	$scope.$on('$destroy', function() {

	});
	
	$scope.initMap = function() {
		
		var latlng = {lat: 16.632507, lng: 120.317550}; // this should be the lat lng of location with id 1

		$scope.map = new google.maps.Map(
		  document.getElementById('map'), {zoom: 10, center: latlng, mapTypeId: google.maps.MapTypeId.HYBRID});

		$scope.marker = new google.maps.Marker({position: latlng, map: $scope.map});
		
	};
	
	$scope.locate = function(id) {
		
		$http({
			url: 'handlers/latlng.php',
			method: 'POST',
			data: {id: id}
		}).then(function success(response) {
			
    		$scope.marker.setVisible(true);
    		$scope.marker.setPosition(response.data);
    		$scope.map.setZoom(10);
    		$scope.map.setCenter(response.data);
			
		}, function error(response) {
			
		});
		
	};	
	
});
