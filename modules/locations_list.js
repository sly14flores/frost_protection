angular.module('app-module', ['bootstrap-modal','module-access','notifications-module']).factory('app', function($http,$timeout,$window,bootstrapModal,access) {
	
	function app() {

		var self = this;
		
		self.data = function(scope) {

			scope.formHolder = {};
			scope.views = {};
			
			scope.loc = {};
			scope.loc.id = 0;
			
			scope.locations = [];

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
		
		self.delete = function(scope, row) {
			
			// if (!access.has(scope,scope.profile.group,scope.module.id,scope.module.privileges.delete)) return;
			
			var onOk = function() {
				
				$http({
					method: 'POST',
					url: 'handlers/locations-delete.php',
					data: {id: row.id}
				}).then(function mySuccess(response) {
					
						self.list(scope);
						
				}, function myError(response) {
			

			
				});

			};
			
			var onCancel = function() { };
			
			bootstrapModal.confirm(scope,'Confirmation','Are you sure you want to Delete?',onOk,onCancel);
			
		};

		self.list = function(scope) {
			
			if (scope.$id > 2) scope = scope.$parent;
			
			$http({
			  method: 'GET',
			  url: 'handlers/locations-list.php'
			}).then(function mySuccess(response) {
				
				scope.locations = angular.copy(response.data);
				
			}, function myError(response) {
				
			});				
			
		};
		
		self.add = function(scope,loc) {
			
			// if (!access.has(scope,scope.profile.group,scope.module.id,scope.module.privileges.add)) return;
			
			var title = 'Add Location';
			
			if (loc == null) {				
				
				scope.loc = {};
				scope.loc.id = 0;
				
			} else {
				
				title = 'Edit Location';
				
				$http({
				  method: 'POST',
				  url: 'handlers/locations-view.php',
				  data: {id: loc.id}
				}).then(function mySuccess(response) {
					
					scope.loc = angular.copy(response.data);			
					
				}, function myError(response) {
					
					//
					
				});					
				
			};

			var onOk = function() {

				if (validate(scope,'loc')) return false;				
				
				$http({
				  method: 'POST',
				  url: 'handlers/locations-save.php',
				  data: scope.loc
				}).then(function mySuccess(response) {				
					
					self.list(scope);
					
				}, function myError(response) {
					
					//
					
				});
				
				return true;
				
			};
		
			bootstrapModal.box(scope,title,'dialogs/location.html',onOk);
			
		};	

	};

	return new app();

});