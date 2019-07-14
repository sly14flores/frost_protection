angular.module('dashboard-module', ['ngSanitize','ui.bootstrap','bootstrap-modal','block-ui','anguFixedHeaderTable']).factory('dashboard', function($http,$timeout,$compile,$window,bootstrapModal,bui) {
	
	function dashboard() {
		
		var self = this;
		
		self.data = function(scope) {
		
			scope.logs = [];
			locations(scope);
			
			scope.page = [];
		
		};

		function locations(scope) {

			$http({
				url: 'handlers/data_list.php',
				method: 'POST',				
			}).then(function success(response) {
				
				scope.logs = response.data;
				
				angular.forEach(scope.logs, function(log,i) {
					
					scope.page.push({
						search: '',
						currentPage: 1,
						pageSize: 15,
						maxSize: 3,
						filterData: log.data
					});
					
				});
				
			}, function error(response) {
				
			});

		};

	};

	return new dashboard();

});
