angular.module('app-module', ['form-validator','bootstrap-modal','ui.bootstrap','ngRoute','module-access','notifications-module']).config(function($routeProvider) {
    $routeProvider
        .when('/:option/:id', {
            templateUrl: 'user-profile.html'
        })
        .when('/:option/:id', {
            templateUrl: 'user-profile.html'
        });		
}).factory('app', function($http,$timeout,$window,$routeParams,$location,validate,bootstrapModal,access) {
	
	function app() {

		var self = this;

		self.startup = function(scope) {
			
			scope.controls.add = true;
			scope.controls.edit = false;	
			
			scope.$on('$routeChangeSuccess', function() {
				
				switch ($routeParams.option) {
					
					case 'view':
					
						if ($routeParams.id != undefined) {					
							self.load(scope,$routeParams.id);
							scope.controls.add = false;
							scope.controls.edit = true;
						};					
					
					break;
					
					case 'delete':
					
						if ($routeParams.id != undefined) {					
							self.load(scope,$routeParams.id);
							scope.controls.add = false;
							scope.controls.edit = false;
							scope.controls.ok=false;
							scope.controls.cancel=false;
							self.deleteConfirm(scope,$routeParams.id);
						};
							
					break;
					
				};				

			});				
			
		};
		
		function validate2(scope,form) {
			
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

		self.data = function(scope) {

			scope.formHolder = {};
			
			scope.views = {};
			
			scope.views.currentPage = 1;
			
			scope.controls = {
				btns: {
					ok: true,
					cancel: true
				},
				add: true,
				edit: true,
				ok: true,
				cancel:true
			};
			
			scope.user = {};
			
			scope.user.id = 0;	
			
			scope.users = [];
				
			scope.groups = [];

			scope.location = [];
			

			scope.views.currentPage = 1;

					
			$http({
				method: 'GET',
				url: 'handlers/groups.php'
			}).then(function mySuccess(response) {
				
				scope.groups = angular.copy(response.data);
					
			}, function myError(response) {
		
		
		
			});

			$http({
				method: 'GET',
				url: 'handlers/locations.php'
			}).then(function mySuccess(response) {
				
				scope.location = angular.copy(response.data);
					
			}, function myError(response) {
		
		
		
			});			

		};
		
		self.add = function(scope) {
			
			if (!access.has(scope,scope.profile.group,scope.module.id,scope.module.privileges.add)) return;
			
			scope.controls.btns.ok = false;
			scope.controls.btns.cancel = false;
			
		};
		
		self.cancel = function(scope) {
			
			scope.controls.btns.ok = true;
			scope.controls.btns.cancel = true;
			
			validate.cancel(scope,'user');
			
			$timeout(function() {
				if ($routeParams.option==undefined) scope.user = {};				
			},500);
			
		};
		
		self.view = function(scope,row) {
			
			$window.location.href = "user-profile.html#!/view/"+row.id;
			
		};
		self.delete = function(scope,row){
			
			if (!access.has(scope,scope.profile.group,scope.module.id,scope.module.privileges.delete)) return;
			
			scope.views.currentPage = scope.currentPage;
			
			$window.location.href = "user-profile.html#!/delete/"+row.id;
			
		};
		
		self.deleteConfirm = function(scope,id) {
			
			var onOk = function() {
				
				$http({
					method: 'POST',
					url: 'handlers/profile-delete.php',
					data: {id: id}
				}).then(function mySuccess(response) {
					
						$window.location.href = "users-list.html";
						
				}, function myError(response) {
			
			
			
				});

			};
			
			var onCancel = function() {
				
				$window.location.href = "users-list.html";
				
			};
			
			bootstrapModal.confirm(scope,'Confirmation','Are you sure you want to Delete?',onOk,onCancel);
				
		};
		
		self.edit = function(scope) {
			
			if (!access.has(scope,scope.profile.group,scope.module.id,scope.module.privileges.edit)) return;
			
			scope.controls.btns.ok = false;
			scope.controls.btns.cancel = false;			
			
		};
		
		self.load = function(scope,id) {
			
			$http({
			  method: 'POST',
			  url: 'handlers/user-view.php',
			  data: {id: id}
			}).then(function mySuccess(response) {
				
				scope.user = angular.copy(response.data);			
				
			}, function myError(response) {
				
				//
				
			});			
			
		};
		
		

		self.save = function(scope) {

			
			if (validate.form(scope,'user')) return;

				$http({
					  method: 'POST',
					  url: 'handlers/profile-save.php',
					  data: scope.user
					}).then(function mySuccess(response) {
						
						if (scope.user.id == 0) {
							scope.user = {};
							scope.user.id = 0;
						};
						scope.controls.btns.ok = true;
						scope.controls.btns.cancel = true;					
						
					}, function myError(response) {
						
						//
						
					});			
			

				
				
					
			
		};
		
		self.list = function(scope) {


			if (scope.$id > 2) scope = scope.$parent;
			console.log(scope);
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
			
			var title = 'Update Balance';
						
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

				if (validate2(scope,'user')) return false;
				
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
		
			bootstrapModal.box(scope,title,'dialogs/credit.html',onOk);


			
		};	

	};

	return new app();

});