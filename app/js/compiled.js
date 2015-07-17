String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
(function () {
	var app = angular.module('app.core', ['ngMaterial', 'ngMdIcons', 'ngMessages', 'ngRoute', 'btford.socket-io', 'md.data.table']);
	app.config(['$mdThemingProvider', function ($mdThemingProvider) {
		$mdThemingProvider.theme('default')
			.primaryPalette('teal')
			.accentPalette('blue-grey');
	}]);
	app.factory('socket', ['socketFactory', function (socketFactory) {
		return socketFactory();
	}]);
	app.run(['$mdToast', '$rootScope', 'socket', function ($mdToast, $rootScope, socket) {
		socket.on('notification', function (data) {
			$mdToast.show(toast(data));
		});
		$rootScope.$on('notification', function (event, data) {
			$mdToast.show(toast(data));
		});
		function toast(data) {
			return $mdToast.simple({
				content: data.message,
				position: 'bottom right'
			});
		};
	}]);
	app.service('observer', function () {
		var observer = this;
		var observerCallbacks = [];
		observer.register = function (service, callback) {
			if (observerCallbacks[service] === undefined)
				observerCallbacks[service] = [];
			observerCallbacks[service].push(callback);
		};
		observer.notify = function (service) {
			angular.forEach(observerCallbacks[service], function (callback) {
				callback();
			});
		};
		return observer;
	});
})();
(function () {
	var app = angular.module('app.routes', ['app.core']);
	app.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
			.when('/', routeOption('home'))
			.when('/about', routeOption('about'))
			.when('/account', secureRouteOption('account', true))
			.when('/faq', routeOption('faq'))
			.when('/logout', routeOption('logout'))
			.when('/messages', secureRouteOption('messages', false))
			.when('/network', secureRouteOption('network', true))
			.when('/settings', secureRouteOption('settings', true))
			.when('/storage', secureRouteOption('storage', true))
			.when('/tasks', secureRouteOption('tasks', false))
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
(function () {
	angular.module('app.authentication', ['app.core'])
		.service('authentication', ['$http', '$mdDialog', '$q', 'observer', function ($http, $mdDialog, $q, observer) {
			var authentication = this;
			var _loggedIn = false;
			var _authenticated = false;
			var _token = undefined;
			var _id = undefined;
			var loadingDialog = function () {
				return $mdDialog.show({
					clickOutsideToClose: false,
					escapeToClose: false,
					disableParentScroll: true,
					template:
					'<md-dialog>' +
						'<md-dialog-content>' +
							'<center>' +
								'Authenticating<br/>' +
								'<md-progress-linear md-mode="indeterminate"></md-progress-linear>' +
							'</center>' +
						'</md-dialog-content>' +
					'</md-dialog>'
				});
			};
			var errorDialog = function () {
				$mdDialog.show({
					clickOutsideToClose: true,
					template:
					'<md-dialog>' +
						'<md-dialog-content>' +
							'<center>' +
								'<h2 style="font-variant:small-caps;">unauthorized<h2>' +
								'<ng-md-icon style="fill:rgba(237,110,110,1)" icon="lock_outline" size="64"></ng-md-icon>' +
							'</center>' +
						'</md-dialog-content>' +
					'</md-dialog>'
				});
			};
			authentication.isLoggedIn = function () { return _loggedIn; };
			authentication.isAuthenticated = function () { return _authenticated; };
			authentication.id = function (id) {
				if (id === undefined)
					return _id;
				else
					_id = id;
			};
			authentication.storeID = function () { localStorage.setItem('id', _id); };
			authentication.loadID = function () { _token = localStorage.getItem('id') || undefined; };
			authentication.clearID = function () { localStorage.removeItem('id'); };
			authentication.token = function (token) {
				if (token === undefined)
					return _token;
				else
					_token = token;
			};
			authentication.storeToken = function () { localStorage.setItem('token', _token); };
			authentication.loadToken = function () { _token = localStorage.getItem('token') || undefined; };
			authentication.clearToken = function () { localStorage.removeItem('token'); };
			authentication.authenticate = function () {
				var defer = $q.defer();
				if (authentication.token() == undefined) {
					$mdDialog.hide();
					_authenticated = false;
					observer.notify('authentication');
					defer.reject();
				}
				loadingDialog();
				$http.post('/login/authenticate', { token: authentication.token() })
					.success(function (data, status, headers, config) {
						$mdDialog.hide();
						_authenticated = true;
						observer.notify('authentication');
						defer.resolve();
					})
					.error(function (err) {
						$mdDialog.hide();
						_authenticated = false;
						observer.notify('authentication');
						errorDialog();
						defer.reject();
					});
				return defer.promise;
			};
			authentication.login = function () {
				var defer = $q.defer();
				$mdDialog.show({
					templateUrl: 'views/partials/loginDialog.html',
					preserveScope: true,
					controller: DialogController,
					locals: {
						defer: defer
					}
				});
				function DialogController($scope, $location, $http, $mdDialog, defer) {
					var DialogController = $scope;
					DialogController.user = {
						username: '',
						password: ''
					};
					DialogController.login = function () {
						$mdDialog.hide();
						loadingDialog();
						$http.post('/login', DialogController.user)
							.success(function (data, status, headers, config) {
								$mdDialog.hide();
								authentication.id(data.id);
								authentication.token(data.token);
								authentication.storeToken();
								authentication.storeID();
								_loggedIn = true;
								_authenticated = true;
								observer.notify('authentication');
								defer.resolve();
							})
							.error(function (err) {
								$mdDialog.hide();
								_loggedIn = false;
								_authenticated = false;
								observer.notify('authentication');
								errorDialog();
								defer.reject('login');
							});
					};
					DialogController.closeDialog = function () {
						$mdDialog.hide();
					};
					return DialogController;
				};
				return defer.promise;
			};
			authentication.logout = function () {
				authentication.token("");
				authentication.id("");
				authentication.clearToken();
				authentication.clearID();
				_authenticated = false;
				_loggedIn = false;
				observer.notify('authentication');
			};
			return authentication;
		}]);
})();
(function () {
	var app = angular.module('app.datastore', ['app.core', 'app.authentication']);
	app.service('datastore', datastore);
	datastore.$inject = ['$http', 'observer', '$rootScope', 'authentication', 'socket'];
	function datastore($http, observer, $rootScope, authentication, socket) {
		var datastore = this;
		var modelStorage = [];
		socket.on('updatedModel', function (data) {
			datastore.get(data.model, data.id);
		});
		datastore.storageLoad = function (mode, id) {
			return modelStorage[mode + id];
		}
		datastore.get = function (model, id) {
			$http.get('/api/' + model.capitalizeFirstLetter() + '/' + id)
				.success(function (data, status, headers, config) {
					modelStorage[model + id] = data;
					observer.notify('datastore');
				})
				.error(function (err) {
					$rootScope.$broadcast('notification', {
						error: true,
						message: "Model " + err
					});
				});
		};

		datastore.update = function (model, object) {
			$http.put('/api/' + model.capitalizeFirstLetter(), { object: object, token: authentication.token() })
				.success(function (data, status, headers, config) {
					datastore.get(model, object.id);
					$rootScope.$broadcast('notification', {
						error: false,
						message: "Model updated"
					});
				})
				.error(function (err) {
					$rootScope.$broadcast('notification', {
						error: true,
						message: "Model " + err
					});
				});
		};
		return datastore;
	};
})();
(function () {
	var app = angular.module('app.layout', ['app.core']);
	app.service('layout', ['$mdSidenav', '$mdToast', 'observer', 'socket', function ($mdSidenav, $mdToast, observer, socket) {
		var layout = this;
		var _page = undefined;
		var _tools = undefined;
		var _dialogs = [];
		socket.on('notifcation', function (data) {
			$mdToast.show($mdToast.simple({
				content: data.message,
				position: 'bottom right'
			}));
		});
		layout.newDialog = function (name, fn) {
			if (_dialogs[name] == undefined)
				_dialogs[name] = [];
			_dialogs[name].push(fn);
		};
		layout.openDialog = function (name) {
			console.log('open');
			angular.forEach(_dialogs[name], function (fn) {
				console.log(fn);
				fn();
			});
		};
		layout.onSwipeLeft = function (sidenav) { $mdSidenav(sidenav).open(); };
		layout.onSwipeRight = function (sidenav) { $mdSidenav(sidenav).close(); };
		layout.toggleSidenav = function (sidenav) { $mdSidenav(sidenav).toggle(); };
		layout.page = function (page) {
			if (page === undefined)
				return _page;
			else
				_page = page;
			observer.notify('layout');
		};
		layout.tools = function (tools) {
			if (tools === undefined)
				return _tools;
			else
				_tools = tools;
			observer.notify('layout');
		};
		return layout;
	}]);
})();
(function () {
	var app = angular.module('app', ['app.core', 'app.authentication', 'app.datastore', 'app.layout', 'app.routes']);
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
	app.controller('homeController', HomeCtrl);
	HomeCtrl.$inject = ['layout'];
	function HomeCtrl(layout) {
		layout.page('Home');
		var HomeCtrl = this;
		return HomeCtrl;
	};
})();
(function () {
	var app = angular.module('app');
	app.controller('aboutController', aboutCtrl);
	aboutCtrl.$inject = ['layout'];
	function aboutCtrl(layout) {
		layout.page("about");
		layout.tools("");
	};
})();
(function () {
	var app = angular.module('app');
	app.controller('accountController', AccountCtrl);
	AccountCtrl.$inject = ['datastore', 'layout', 'observer'];
	function AccountCtrl(datastore, layout, observer) {
		var AccountCtrl = this;
		AccountCtrl.logs =[{action:'Create',item:'Test VM', date: 'Mon Sep 28 1998 14:36:22 GMT-0700', result: 'OK'},{action:'Create',item:'Test VM 3', date: 'Mon Sep 28 1999 14:36:22 GMT-0700', result: 'OK'},{action:'Create',item:'Test VM 2', date: 'Mon Sep 28 1999 14:36:22 GMT-0700', result: 'OK'}];
		layout.page("account");
		layout.tools("");
		return AccountCtrl;
	};
})();
(function () {
	var app = angular.module('app');
	app.controller('faqController', faqCtrl);
	faqCtrl.$inject = ['layout'];
	function faqCtrl(layout) {
		var faqCtrl = this;
		layout.page("F.A.Q");
		layout.tools("");
		return faqCtrl;
	};
})();
(function () {
	var app = angular.module('app');
	app.controller('logoutController', LogoutCtrl);
	LogoutCtrl.$inject = ['$location', 'authentication'];
	function LogoutCtrl($location, authentication) {
		var LogoutCtrl = this;
		authentication.logout();
		$location.path('/');
		return LogoutCtrl;
	};
})();
(function () {
	var app = angular.module('app');
	app.controller('MainController', mainCtrl);
	mainCtrl.$inject = ['authentication', 'datastore', 'layout', '$location', 'observer'];
	function mainCtrl(authentication, datastore, layout, $location, observer) {
		var mainCtrl = this;
		var userID;
		observer.register('authentication', function () {
			userID = authentication.id();
			datastore.get('User', userID);
		});
		observer.register('datastore', function () {
			mainCtrl.user = datastore.storageLoad('User', userID);
		});
		observer.register('authentication', function () {
			mainCtrl._authenticated = authentication.isAuthenticated();
		});
		observer.register('layout', function () {
			mainCtrl.title = layout.page().capitalizeFirstLetter();
		});
		observer.register('layout', function () {
			mainCtrl.tools = layout.tools();
		});
		mainCtrl.layout = layout;
		mainCtrl.traverse = function (link) {
			$location.path(link);
			layout.toggleSidenav('left');
		};
		mainCtrl.mainMenu = [
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
		mainCtrl.managementMenu = [
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
				title: 'Network Adapters',
				icon: 'public'
			},
			// {
			// 	link: '/messages',
			// 	title: 'Messages',
			// 	icon: 'message'
			// },
			// {
			// 	link: '/tasks',
			// 	title: 'Tasks',
			// 	icon: 'list'
			// },
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

		return mainCtrl;
	};
})();
(function () {
	var app = angular.module('app');
	app.controller('networkController', networkCtrl);
	networkCtrl.$inject = ['layout'];
	function networkCtrl(layout) {
		var networkCtrl = this;
		networkCtrl.selected = [];
		layout.page('network adapters');
		layout.newDialog('networkCreate', function () {
			console.log('Create new network adapter dialog');
		});
		layout.newDialog('networkDelete', function () {
			console.log('Delete selected network adapter dialog');
		});
		layout.tools([
			{
				action: layout.openDialog,
				params: 'networkCreate',
				icon: "add",
				tooltip: {
					message: "Create new network adapter",
					direction: "left"
				}
			},
			{
				action: layout.openDialog,
				params: 'networkDelete',
				icon: "delete",
				tooltip: {
					message: "Delete network adapter",
					direction: "left"
				}
			}
		]);
		return networkCtrl;
	};
})();
(function () {
	var app = angular.module('app');
	app.controller('settingsController', SettingsCtrl);
	SettingsCtrl.$inject = ['datastore', 'layout', 'observer'];
	function SettingsCtrl(datastore, layout, observer) {
		var SettingsCtrl = this;
		layout.page("settings");
		layout.tools("");
		SettingsCtrl.save = function (Model, Object) {
			datastore.update(Model, Object);
		};
		return SettingsCtrl;
	};
})();
(function () {
	var app = angular.module('app');

	app.controller('vmController', vmCtrl);
	vmCtrl.$inject = ['layout', '$mdBottomSheet', '$mdToast'];
	function vmCtrl(layout, $mdBottomSheet, $mdToast) {
		var vmCtrl = this;
		vmCtrl.selected = [];
		vmCtrl.vms = [];
		layout.page("Virtual Machines");
		layout.newDialog('vmCreate', function () {
			$mdBottomSheet.show({
				templateUrl: 'views/partials/createVM.tmpl.html',
				controller: bottomCtrl
			});
			function bottomCtrl($scope) {
				$scope.launch = function (vm) {
					if (vm.name == undefined || vm.os == undefined || vm.network == undefined) {
						$mdToast.show($mdToast.simple({
							content: 'Warning items are missing!'
						}));
						return;
					}
					vm.status = 'OFF';
					vmCtrl.vms.push(vm);
					$mdBottomSheet.hide();
				};
				$scope.close = function () {
					$mdBottomSheet.hide();
				};
			};
		});
		function Test(item) {
			console.log(item);
		};
		layout.tools([
			{
				action: layout.openDialog,
				params: 'vmCreate',
				icon: "add",
				tooltip: {
					message: "Create new VM",
					direction: "left"
				}
			},
			{
				action: Test,
				params: vmCtrl.selected,
				icon: "description",
				tooltip: {
					message: "View VM",
					direction: "left"
				}
			},
			{
				action: layout.openDialog,
				params: 'vmCreate',
				icon: "delete",
				tooltip: {
					message: "Delete VM",
					direction: "left"
				}
			}
		]);
		return vmCtrl;
	};
})();