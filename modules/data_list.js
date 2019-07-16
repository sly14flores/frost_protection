angular.module('app-module', ['ngSanitize','ui.bootstrap','bootstrap-modal','block-ui','anguFixedHeaderTable']).factory('app', function($http,$timeout,$compile,$window,bootstrapModal,bui) {
	
	function app() {
		
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
						pageSize: 10,
						maxSize: 3,
						filterData: log.data
					});
					
				});
				
			}, function error(response) {
				
			});

		};

	};

	return new app();

});
