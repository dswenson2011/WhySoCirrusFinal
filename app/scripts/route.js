(function () {
	var app = angular.module('app.routes', ['app.core']);
	app.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
			.when('/', routeOption('home'))
			.when('/about', routeOption('about'))
			.when('/account', secureRouteOption('account', true))
			.when('/faq', routeOption('faq'))
			.when('/logout', routeOption('logout'))
			.when('/network', secureRouteOption('network', true))
			.when('/settings', secureRouteOption('settings', true))
			.when('/storage', secureRouteOption('storage'))
			.when('/vm', secureRouteOption('vm', true));
	}]);
	function routeOption(route) {
		return {
			controller: route + 'Controller',
			controllerAs: route,
			templateUrl: 'views/partials/' + route + '.html'
		};
	};
	function secureRouteOption(route, login) {
		var option = routeOption(route);
		option.access = {
			requiresLogin: login
		};
		return option;
	};
})();