(function () {
	var app = angular.module('app', ['app.core', 'app.authentication', 'app.layout']);
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
				requireLogin: false
			}
		});
	});
	app.controller('AccountController', function(){
		var vm = this;
		return vm;
	})
	app.controller('MainController', MainCtrl);
	app.controller('LogoutController', LogoutCtrl);
	app.controller('HomeController', HomeCtrl);
	MainCtrl.$inject = ['$location', 'authentication', 'observer', 'socket', 'layout'];
	function MainCtrl($location, authentication, observer, socket, layout) {
		var MainCtrl = this;
		observer.register('authentication', function () {
			MainCtrl._authenticated = authentication.isAuthenticated();
		});
		observer.register('layout', function () {
			MainCtrl.title = layout.page().capitalizeFirstLetter();
		});
		MainCtrl.layout = layout;
		MainCtrl.traverse = function (link) {
			$location.path(link);
			layout.toggleSidenav('left');
		}
		MainCtrl.management = [
			{
				link: '/vm',
				title: 'Virtual Machines',
				icon: 'cloud'
			},
			{
				link: '/storage',
				title: 'Virtual Disks',
				icon: 'storage'
			},
			{
				link: '/network',
				title: 'Network Connection',
				icon: 'public'
			},
			{
				link: '/messages',
				title: 'Messages',
				icon: 'message'
			},
			{
				link: '/tasks',
				title: 'Tasks',
				icon: 'list'
			},
			{
				link: '/settings',
				title: 'Settings',
				icon: 'settings'
			},
			{
				link: '/logout',
				title: 'Logout',
				icon: 'logout',
			}
		];
		MainCtrl.menu = [
			{
				link: '/',
				title: 'Dashboard',
				icon: 'dashboard'
			},
			{
				link: '/about',
				title: 'About',
				icon: 'info_outline'
			},
			{
				link: '/faq',
				title: 'F.A.Q',
				icon: 'question_answer'
			},
			{
				link: '/account',
				title: 'Account',
				icon: 'account_circle'
			}
		];
		return MainCtrl;
	};
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