(function () {
	var app = angular.module('app', ['app.core', 'app.authentication', 'app.datastore', 'app.layout', 'app.routes', 'app.virtualMachine', 'app.virtualSwitch']);
	app.run(['authentication', function (authentication) {
		if (authentication.token() === undefined)
			authentication.loadToken();
		if (authentication.id() === undefined)
			authentication.loadID();
	}]);
	app.run(['$rootScope', '$location', 'authentication', function ($rootScope, $location, authentication) {
		$rootScope.$on('$routeChangeStart', function (event, next) {
			if (next.access !== undefined) {
				if (authentication.isAuthenticated()) {
					if (next.access.requiresLogin && !authentication.isLoggedIn()) {
						event.preventDefault();
						authentication.login().then(function () {
							$location.path(next.originalPath);
						}, function (login) {
							if (login !== undefined)
								$location.path('/logout');
							$location.path($location.path());
						});
					}
				} else {
					event.preventDefault();
					authentication.authenticate().then(function () {
						$location.path(next.originalPath);
					}, function () {
						authentication.login().then(function () {
							$location.path(next.originalPath);
						}, function (login) {
							if (login !== undefined)
								$location.path('/logout');
							$location.path($location.path());
						});
					});
				}
			}
		});
	}]);
})();