var app = angular.module('WhySoCirrus', ['ngMaterial', 'ngMdIcons', 'ngMessages', 'ngRoute']);

app.config(function ($mdThemingProvider) {
	$mdThemingProvider.theme('default')
		.primaryPalette('teal')
		.accentPalette('blue-grey');
	$mdThemingProvider.alwaysWatchTheme(true);
});

app.run(['authenticationService', function (authenticationService) {
	if (authenticationService.getToken() == undefined)
		authenticationService.loadToken();
}]);

app.run(['$rootScope', '$location', 'authenticationService',
	function ($rootScope, $location, authenticationService) {
		$rootScope.$on('$routeChangeStart', function (event, next) {
			if (next.access != undefined) {
				if (authenticationService.isAuthenticated()) {
					if (next.access.requiresLogin) {
						if (!authenticationService.isLoggedIn()) {
							event.preventDefault();
							authenticationService.login().then(
								function () {
									$location.path(next.originalPath);
								},
								function (login) {
									if (login != undefined)
										$location.path('/logout');
									$location.path($location.path());
									authenticationService.error();
								});
						}
					}
				} else {
					event.preventDefault();
					authenticationService.authenticate().then(
						function () {
							$location.path(next.originalPath);
						},
						function () {
							authenticationService.login().then(
								function () {
									$location.path(next.originalPath);
								},
								function (login) {
									if (login != undefined)
										$location.path('/logout');
									$location.path($location.path());
									authenticationService.error();
								})
						});
				}
			}
		});
	}
]);

app.config(function ($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'views/partials/home.html',
		controller: 'homeCtrl'
	}).when('/logout', {
		templateUrl: 'views/partials/login.html',
		controller: 'logoutCtrl'
	}).when('/search', {
		templateUrl: 'views/partials/search.html',
		controller: 'searchCtrl'
	}).when('/faq', {
		templateUrl: 'views/partials/home.html',
		controller: 'faqCtrl'
	}).when('/about', {
		templateUrl: 'views/partials/home.html',
		controller: 'aboutCtrl'
	}).when('/account', {
		templateUrl: 'views/partials/home.html',
		controller: 'aboutCtrl',
		access: {
			requiresLogin: false
		}
	}).when('/vm', {
		templateUrl: 'views/partials/home.html',
		controller: 'aboutCtrl',
		access: {
			requiresLogin: true
		}
	}).when('/messages', {
		templateUrl: 'views/partials/home.html',
		controller: 'aboutCtrl',
		access: {
			requiresLogin: false
		}
	}).when('/tasks', {
		templateUrl: 'views/partials/home.html',
		controller: 'aboutCtrl',
		access: {
			requiresLogin: true
		}
	}).when('/storage', {
		templateUrl: 'views/partials/home.html',
		controller: 'aboutCtrl',
		access: {
			requiresLogin: true
		}
	}).when('/network', {
		templateUrl: 'views/partials/home.html',
		controller: 'aboutCtrl',
		access: {
			requiresLogin: true
		}
	}).when('/settings', {
		templateUrl: 'views/partials/home.html',
		controller: 'aboutCtrl',
		access: {
			requiresLogin: true
		}
	});
});

app.controller('mainCtrl', function ($rootScope, $scope, $location, layout, $mdSidenav, $mdDialog, authenticationService) {
	$scope.theme = "default";
	$scope.clickCloud = function () {
		var strings = ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey'];
		var rand = Math.floor(Math.random() * strings.length);
		$scope.theme = strings[rand];
	};

	$scope.onSwipeLeft = function () {
		$mdSidenav('left').toggle();
	};
	$scope.onSwipeRight = function () {
		$mdSidenav('left').toggle();
	};
	authenticationService.registerObserverCallback(function () {
		$scope._authenticated = authenticationService._authenticated;
	});
	$scope.traverse = function (link) {
		$location.path(link);
		$mdSidenav('left').close();
	};
	$scope.management = [
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
	$scope.menu = [
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
	$scope.toggleSidenav = function (menuId) {
		$mdSidenav(menuId).toggle();
	};
	layout.registerObserverCallback(function () {
		$scope.title = layout.getPage().capitalizeFirstLetter();
	});
});

app.controller('searchCtrl', function ($scope, layout) {
	layout.setPage('search');
});

app.controller('loginCtrl', function ($scope, $mdDialog, layout) {
	layout.setPage('login');

});

app.controller('homeCtrl', function ($scope, layout) {
	layout.setPage('home');
});

app.controller('aboutCtrl', function ($scope, layout) {
	layout.setPage('about');
});

app.controller('faqCtrl', function ($scope, layout) {
	layout.setPage('F.A.Q');
});

app.controller('logoutCtrl', function ($scope, $location, authenticationService, layout) {
	authenticationService.logout();
	$location.path('/');
});