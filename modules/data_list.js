angular.module('dashboard-module', ['ngSanitize','ui.bootstrap','bootstrap-modal','block-ui','anguFixedHeaderTable']).factory('dashboard', function($http,$timeout,$compile,$window,bootstrapModal,bui) {
	
	function dashboard() {
		
		var self = this;
		
		self.data = function(scope) {
		
			scope.entries_list = [];
			
			entries_list(scope);
		
		};

		function entries_list(scope) {
			
			$http({
				url: 'handlers/data.php',
				method: 'POST',				
			}).then(function success(response) {
				
				scope.entries_list = response.data;
				
			}, function error(response) {
				
			});			
		};
	
		
	};
	
	return new dashboard();
	
});
