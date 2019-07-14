angular.module('dashboard-module', ['ngSanitize','ui.bootstrap','bootstrap-modal','block-ui','anguFixedHeaderTable']).factory('dashboard', function($http,$timeout,$compile,$window,bootstrapModal,bui) {
	
	function dashboard() {
		
		var self = this;
		
		self.data = function(scope) {
		
			scope.locations = [];
			locations(scope);
			
		
		};

		function locations(scope) {
			
			$http({
				url: 'handlers/data_list.php',
				method: 'POST',				
			}).then(function success(response) {
				
				scope.data = response.data;
				
			}, function error(response) {
				
			});		
		};
	
		
	};
	
	return new dashboard();
	
});
