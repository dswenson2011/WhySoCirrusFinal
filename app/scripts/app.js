(function () {
	var app = angular.module('app', ['app.core', 'app.authentication', 'app.datastore', 'app.layout']);
	app.run(['authentication', function (authentication) {
		if (authentication.token() === undefined)
			authentication.loadToken();
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
	app.config(function ($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'views/partials/home.html',
			controller: 'HomeController'
		}).when('/logout', {
			templateUrl: 'views/partials/home.html',
			controller: 'LogoutController'
		}).when('/account', {
			templateUrl: 'views/partials/home.html',
			controller: 'AccountController',
			access: {
				requiresLogin: false
			}
		}).when('/vm', {
			templateUrl: 'views/partials/home.html',
			controller: 'AccountController',
			access: {
				requiresLogin: true
			}
		});
	});

	app.controller('AccountController', ['layout', function (layout) {
		var vm = this;
		layout.page('SecuredArea');
		return vm;
	}]);

	app.controller('LogoutController', LogoutCtrl);
	app.controller('HomeController', HomeCtrl);
	LogoutCtrl.$inject = ['$location', 'authentication'];
	function LogoutCtrl($location, authentication) {
		var LogoutCtrl = this;
		authentication.logout();
		$location.path('/');
		return LogoutCtrl;
	};
	HomeCtrl.$inject = ['layout'];
	function HomeCtrl(layout) {
		layout.page('Home');
		var HomeCtrl = this;
		return HomeCtrl;
	};
})();