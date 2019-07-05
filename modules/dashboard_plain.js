angular.module('dashboard-module', ['ui.bootstrap','bootstrap-modal','block-ui','module-access','anguFixedHeaderTable']).factory('dashboard', function($http,$timeout,$compile,$window,bootstrapModal,bui,access) {
	
	function dashboard() {
		
		var self = this;
		
		self.data = function(scope) {
		
			scope.infos = {};

			scope.info.id = 0;	
			
			scope.infos = [];

			scope.dash = {};
		
		};
		
		self.list = function(scope) {
			
			$http({
				method: 'GET',
				url: 'handlers/dashboard.php',
			}).then(function mySuccess(response) {
				
				scope.infos = angular.copy(response.data);			
				
			}, function myError(response) {
				
				//
				
			});

			$http({
				method: 'GET',
				url: 'handlers/dash.php',
			}).then(function mySuccess(response) {
				
				scope.dash = angular.copy(response.data);			
				
			}, function myError(response) {
				
				//
				
			});	
			
		}
		
	};
	
	
	
	return new dashboard();
	
});
