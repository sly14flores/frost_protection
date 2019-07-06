angular.module('app-module', ['ui.bootstrap','bootstrap-modal','block-ui','anguFixedHeaderTable']).factory('app', function($http,$timeout,$compile,$window,bootstrapModal,bui) {
	
	function app() {
		
		var self = this;
		
		self.data = function(scope) {

			scope.data_logs = {};
		
		};
		
		self.list = function(scope) {
			
			if (scope.$id > 2) scope = scope.$parent;
						console.log(scope);
						scope.currentPage = scope.views.currentPage; // for pagination
						scope.pageSize = 10; // for pagination
						scope.maxSize = 3; // for pagination

						$http({
						  method: 'GET',
						  url: 'handlers/data.php'
						}).then(function mySuccess(response) {

							scope.data_logs = angular.copy(response.data);	

							scope.filterData = scope.data_logs; // for pagination
							scope.currentPage = scope.views.currentPage; // for pagination 							
					
				}, function myError(response) {
						
						//
						
					});	
			
		}
		
	};
	
	
	
	return new app();
	
});
