angular.module('app-module', ['form-validator','bootstrap-modal','ui.bootstrap','ngRoute','module-access','notifications-module']).factory('app', function($http,$timeout,$window,$routeParams,$location,validate,bootstrapModal,access) {
	
	function app() {

		var self = this;

		self.data = function(scope) {

			scope.formHolder = {};
			scope.views = {};
			
			scope.user = {};

			scope.user.id = 0;
			
			scope.users = [];

		};
		
		function validate(scope,form) {
			
			var controls = scope.formHolder[form].$$controls;
			
			angular.forEach(controls,function(elem,i) {

				if (elem.$$attr.$attr.required) {
					
					scope.$apply(function() {
						
						elem.$touched = elem.$invalid;
						
					});
					
				};
									
			});

			return scope.formHolder[form].$invalid;
			
		};
		
		self.list = function(scope) {
			
			scope.currentPage = scope.views.currentPage; // for pagination
			scope.pageSize = 10; // for pagination
			scope.maxSize = 3; // for pagination

			$http({
			  method: 'GET',
			  url: 'handlers/users-list.php'
			}).then(function mySuccess(response) {
				

				scope.users = angular.copy(response.data);	

				scope.filterData = scope.users; // for pagination
				scope.currentPage = scope.views.currentPage; // for pagination 							

				
			}, function myError(response) {
				
				//
				
			});				
			
		};

		self.collect = function(scope,user) {
			
						
			$http({
			  method: 'POST',
			  url: 'handlers/credit-view.php',
			  data: {id: user.id}
			}).then(function mySuccess(response) {
				
				scope.user = angular.copy(response.data);			
				
			}, function myError(response) {
				
				//
				
			});			
					
				
			

			var onOk = function() {			
				
				if (validate.form(scope,'user')) return false;

				$http({
				  method: 'POST',
				  url: 'handlers/credit-save.php',
				  data: scope.user
				}).then(function mySuccess(response) {
					
					self.list(scope);

				}, function myError(response) {
					
					//
					
				});			
				
				return true;
			};
		
			bootstrapModal.box(scope,"Balance",'dialogs/credit.html',onOk);


			
		};	

	};

	return new app();

});