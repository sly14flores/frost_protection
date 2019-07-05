angular.module('login-module', []).service('loginService', function($http, $window) {
	
	this.login = function(scope) {
		
		scope.views.incorrect = false;

		$http({
		  method: 'POST',
		  url: 'handlers/login.php',
		  data: scope.account
		}).then(function mySuccess(response) {

			if (response.data['login']) {
				scope.views.incorrect = false;
				$window.location.href = 'index.html';
			} else {
				scope.views.incorrect = true;
			}
			
		},
		function myError(response) {

		});
		
	};
	
});