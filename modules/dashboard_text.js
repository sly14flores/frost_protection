angular.module('dashboard-module', ['ui.bootstrap','bootstrap-modal','block-ui','module-access','anguFixedHeaderTable']).factory('dashboard', function($http,$timeout,$compile,$window,bootstrapModal,bui,access) {
	
	function dashboard() {
		
		var self = this;

		var counter = 0;
		
		self.data = function(scope) {
		
			scope.infos = {};

			scope.info.id = 0;	
			
			scope.infos = [];

			scope.dash = {};
		
		};
		
		self.textAdmin = function(scope) {
			$http({
			  method: 'POST',
			  url: 'https://www.itexmo.com/php_api/api.php',
			  data: {1:"09301598842",
			  		 2:"1 Container Empty",
			  		 3:"TR-MCGLE598842_JIW1S",
			  		 5:"HIGH"}
			}).then(function mySuccess(response) {

				
			},
			function myError(response) {

			});
		}

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
				if ((scope.dash.container < 2) && (counter == 0)) {
					self.textAdmin(scope);
					counter = 1;
				};

				if ((scope.dash.container == 2) && (counter != 0)) {
					counter = 0;
				};
				
			}, function myError(response) {
				
				//
				
			});	
			
		}
		
	};
	
	
	
	return new dashboard();
	
});
