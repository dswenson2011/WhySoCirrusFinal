String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
(function () {
	var app = angular.module('app.core', ['ngMaterial', 'ngMdIcons', 'ngMessages', 'ngRoute', 'angular-md5', 'btford.socket-io', 'md.data.table']);
	app.config(['$mdThemingProvider', function ($mdThemingProvider) {
		$mdThemingProvider.theme('default')
			.primaryPalette('teal')
			.accentPalette('blue-grey');
	}]);
	app.filter('arrayFilter', function () {
		return function (input) {
			var newInput = [];
			angular.forEach(input, function (item) {
				if (item != "") newInput.push(item);
			});
			return newInput;
		};
	});
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
			.when('/dashboard', secureRouteOption('dashboard', true))
			.when('/account', secureRouteOption('account', true))
			.when('/faq', routeOption('faq'))
			.when('/logout', routeOption('logout'))
			.when('/network', secureRouteOption('network', true))
			.when('/settings', secureRouteOption('settings', true))
			.when('/storage', secureRouteOption('storage'))
			.when('/vm', routeOption('vm'));
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
	var app = angular.module('app.authentication', ['app.core']);
	app.service('authentication', authentication);
	authentication.$inject = ['$http', '$mdDialog', '$q', 'observer'];
	function authentication($http, $mdDialog, $q, observer) {
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
	}
})();
(function () {
	var app = angular.module('app.datastore', ['app.core']);
	app.service('datastore', datastore);
	datastore.$inject = ['$http', 'observer', '$rootScope', 'socket'];
	function datastore($http, observer, $rootScope, socket) {
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
		datastore.create = function (model, object, token) {
			$http.post('/api/' + model.capitalizeFirstLetter(), { object: object, token: token })
				.success(function (data, status, headers, config) {
					modelStorage[model + data.id] = data.object;
					observer.notify('datastore');
				})
				.error(function (err) {
					$rootScope.$broadcast('notifcation', {
						error: true,
						message: "Model " + err
					});
				});
		};
		datastore.update = function (model, object, token) {
			$http.put('/api/' + model.capitalizeFirstLetter(), { object: object, token: token })
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
			angular.forEach(_dialogs[name], function (fn) {
				fn();
			});
		};
		layout.removeDialog = function (name) {
			if(_dialogs[name] == undefined)
				return
			_dialogs[name].pop();
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
	var app = angular.module('app.logger', []);
	app.service('logger', logger);
	logger.$inject = [];
	function logger() {
		var logger = this;
		return logger;
	}
})();
(function () {
	var app = angular.module('app.virtualMachine', ['app.core']);
	app.service('virtualMachine', virtualMachine);
	virtualMachine.$inject = ['observer', '$http'];
	function virtualMachine(observer, $http) {
		var virtualMachine = this;
		virtualMachine.launch = function (vm, token) {
			$http.post('/api/vm/launch', { vm: vm, token: token })
				.success(function (data, status, headers, config) {

				})
				.error(function (error) {

				});
		};
		return virtualMachine;
	};
})();
(function () {
	var app = angular.module('app.virtualSwitch', ['app.core']);
	app.service('virtualSwitch', virtualSwitch);
	virtualSwitch.$inject = ['observer', '$http', '$q'];
	function virtualSwitch(observer, $http, $q) {
		var virtualSwitch = this;
		virtualSwitch.launch = function (vs, token) {
			$http.post('/VS/Create', { vs: vs, token: token })
				.success(function (data, status, headers, config) {
					console.log(data);
				})
				.error(function (error) {
					console.log(error);
				});
		};
		virtualSwitch.findAll = function () {
			var defer = $q.defer();
			$http.get('/VS/')
				.success(function (data, status, headers, config) {
					defer.resolve(data);
				})
				.error(function (error) {
					console.log(error);
					defer.reject([]);
				});
			return defer.promise;
		};

		virtualSwitch.find = function (SeachParams) {

		}
		return virtualSwitch;
	};
})();
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
(function () {
	var app = angular.module('app');
	app.controller('aboutController', aboutCtrl);
	aboutCtrl.$inject = ['layout'];
	function aboutCtrl(layout) {
		layout.page('about');
		layout.tools('');
	};
})();
(function () {
	var app = angular.module('app');
	app.controller('accountController', AccountCtrl);
	AccountCtrl.$inject = ['authentication', 'datastore', 'layout', 'observer'];
	function AccountCtrl(authentication, datastore, layout, observer) {
		var AccountCtrl = this;
		AccountCtrl.query = {
			order: 'name',
			limit: 5,
			page: 1,
			filter: ''
		};
		AccountCtrl.filter = function (item, index) {
			return index >= (AccountCtrl.query.limit * (AccountCtrl.query.page - 1));
		};
		AccountCtrl.logs = [
			{ action: 'Create', item: 'Test VM', date: 'Mon Sep 28 1998 14:36:22 GMT-0700', result: 'OK' }
		];
		layout.page('account');
		layout.tools('');
		return AccountCtrl;
	};
})();
(function () {
	var app = angular.module('app');
	app.controller('dashboardController', DashboardCtrl);
	DashboardCtrl.$inject = ['layout'];
	function DashboardCtrl(layout) {
		layout.page('dashboard');
		layout.tools('');
		var DashboardCtrl = this;
		return DashboardCtrl;
	};
})();
(function () {
	var app = angular.module('app');
	app.controller('faqController', faqCtrl);
	faqCtrl.$inject = ['layout'];
	function faqCtrl(layout) {
		var faqCtrl = this;
		layout.page('F.A.Q');
		layout.tools('');
		return faqCtrl;
	};
})();
(function () {
	var app = angular.module('app');
	app.controller('homeController', HomeCtrl);
	HomeCtrl.$inject = ['layout'];
	function HomeCtrl(layout) {
		layout.page('home');
		layout.tools('');
		var HomeCtrl = this;
		return HomeCtrl;
	};
})();
(function () {
	var app = angular.module('app');
	app.controller('logoutController', LogoutCtrl);
	LogoutCtrl.$inject = ['$location', 'authentication', 'layout'];
	function LogoutCtrl($location, authentication, layout) {
		var LogoutCtrl = this;
		layout.page('Logout');
		layout.tools('');
		authentication.logout();
		$location.path('/');
		return LogoutCtrl;
	};
})();
(function () {
	var app = angular.module('app');
	app.controller('MainController', mainCtrl);
	mainCtrl.$inject = ['authentication', 'datastore', 'layout', '$location', 'md5', '$scope', 'observer'];
	function mainCtrl(authentication, datastore, layout, $location, md5, $scope, observer) {
		var mainCtrl = this;
		mainCtrl.hash = function (item) {
			return md5.createHash(item || '');
		};
		var userID;
		observer.register('authentication', function () {
			userID = authentication.id();
			datastore.get('User', userID);
		});
		observer.register('datastore', function () {
			mainCtrl.user = datastore.storageLoad('User', userID);
			mainCtrl.user.groupList = function (input) {
				var newInput = [];
				angular.forEach(input, function (item) {
					if (item != "") newInput.push(item);
				});
				return newInput;
			} (mainCtrl.user.groupList);
			if (mainCtrl.user.groupList == 'guest') {
				$scope.$emit('notification', { error: true, message: "You are on a guest account" });
			}
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
				title: 'Home',
				icon: 'home'
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
				link: '/dashboard',
				title: 'Dashboard',
				icon: 'dashboard'
			}
		];
		mainCtrl.managementMenu = [
			{
				link: '/account',
				title: 'Account',
				icon: 'account_circle'
			},
			{
				link: '/network',
				title: 'Network',
				icon: 'public'
			},
			{
				link: '/storage',
				title: 'storage',
				icon: 'storage'
			},
			{
				link: '/vm',
				title: 'Virtual Machines',
				icon: 'cloud_circle'
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

		return mainCtrl;
	};
})();
(function () {
	var app = angular.module('app');
	app.controller('networkController', networkCtrl);
	networkCtrl.$inject = ['layout', '$scope', '$mdBottomSheet', '$mdToast', 'virtualSwitch'];
	function networkCtrl(layout, $scope, $mdBottomSheet, $mdToast, virtualSwitch) {
		var networkCtrl = this;
		networkCtrl.vss = [];
		virtualSwitch.findAll().then(function (data) { networkCtrl.vss = data }, function (data) { networkCtrl.vss = data });
		networkCtrl.query = {
			order: 'Name',
			limit: 5,
			page: 1,
			filter: ''
		};
		networkCtrl.filter = function (item, index) {
			return index >= (networkCtrl.query.limit * (networkCtrl.query.page - 1));
		};
		networkCtrl.selected = [];
		$scope.$on('$destroy', function () {
			layout.removeDialog('networkCreate');
			layout.removeDialog('networkDelete');
		});
		layout.page('network');
		layout.newDialog('networkCreate', function () {
			$mdBottomSheet.show({
				templateUrl: 'views/partials/createVS.tmpl.html',
				controller: bottomCtrl
			});
			bottomCtrl.$inject = ['$scope', 'virtualSwitch'];
			function bottomCtrl($scope, virtualSwitch) {
				$scope.launch = function (vs) {
					if (vs.Name == undefined || vs.SwitchType == undefined) {
						$mdToast.show($mdToast.simple({
							content: 'Warning items are missing!'
						}));
						return;
					}
					virtualSwitch.launch(vs);
					networkCtrl.vss.push(vs);
					$mdBottomSheet.hide();
				};
				$scope.close = function () {
					$mdBottomSheet.hide();
				};
			};
		});
		layout.newDialog('networkDelete', function () {
			console.log('Delete selected network switch dialog');
		});
		layout.tools([
			{
				action: layout.openDialog,
				params: 'networkCreate',
				icon: "add",
				tooltip: {
					message: "Create new network switch",
					direction: "left"
				}
			},
			{
				action: layout.openDialog,
				params: 'networkDelete',
				icon: "delete",
				tooltip: {
					message: "Delete network switch",
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
	SettingsCtrl.$inject = ['authentication', 'datastore', 'layout', 'observer'];
	function SettingsCtrl(authentication, datastore, layout, observer) {
		var SettingsCtrl = this;
		layout.page('settings');
		layout.tools('');
		SettingsCtrl.save = function (Model, Object) {
			datastore.update(Model, Object, authentication.token());
		};
		return SettingsCtrl;
	};
})();
(function () {
	var app = angular.module('app');
	app.controller('storageController', storageCtrl);
	storageCtrl.$inject = ['layout', '$scope', '$mdBottomSheet', '$mdToast'];
	function storageCtrl(layout, $scope, $mdBottomSheet, $mdToast) {
		var storageCtrl = this;
		$scope.$on('$destroy', function () {
			layout.removeDialog('storageCreate');
			layout.removeDialog('storageDelete');
		});
		layout.page('storage');
		layout.newDialog('storageCreate', function () {
			$mdBottomSheet.show({
				templateUrl: 'views/partials/createVD.tmpl.html',
				controller: bottomCtrl
			});
			bottomCtrl.$inject = ['$scope', 'virtualMachine'];
			function bottomCtrl($scope, virtualDisk) {
				$scope.launch = function (vhd) {
					if (vhd.name == undefined || vhd.operatingSystem == undefined) {
						$mdToast.show($mdToast.simple({
							content: 'Warning items are missing!'
						}));
						return;
					}
					virtualDisk.launch(vhd);
					storageCtrl.vhd.push(vhd);
					$mdBottomSheet.hide();
				};
				$scope.close = function () {
					$mdBottomSheet.hide();
				};
			};
		});
		layout.newDialog('storageDelete', function () {
			console.log('Delete selected storage disk dialog');
		});
		layout.tools([
			{
				action: layout.openDialog,
				params: 'storageCreate',
				icon: "add",
				tooltip: {
					message: "Create new storage disk",
					direction: "left"
				}
			},
			{
				action: layout.openDialog,
				params: 'storageDelete',
				icon: "delete",
				tooltip: {
					message: "Delete storage disk",
					direction: "left"
				}
			}
		]);
		return storageCtrl;
	};
})();
(function () {
	var app = angular.module('app');
	app.controller('vmController', vmCtrl);
	vmCtrl.$inject = ['layout', '$mdBottomSheet', '$mdDialog', '$mdToast', '$scope'];
	function vmCtrl(layout, $mdBottomSheet, $mdDialog, $mdToast, $scope) {
		var vmCtrl = this;
		$scope.$on('$destroy', function () {
			layout.removeDialog('vmCreate');
			layout.removeDialog('vmCommand');
		});
		vmCtrl.selected = [];
		vmCtrl.vms = [];
		layout.page('virtual machines');
		layout.newDialog('vmCommand', function () {
			$mdDialog.show({
				templateUrl: 'views/partials/commandsVM.tmpl.html',
				controller: bottomCtrl
			});
			function bottomCtrl($scope) {
			};
		});
		layout.newDialog('vmCreate', function () {
			$mdBottomSheet.show({
				templateUrl: 'views/partials/createVM.tmpl.html',
				controller: bottomCtrl
			});
			bottomCtrl.$inject = ['$scope', 'virtualMachine', 'authentication'];
			function bottomCtrl($scope, virtualMachine, authentication) {
				$scope.launch = function (vm) {
					if (vm.name == undefined || vm.operatingSystem == undefined || vm.networkAdapter == undefined) {
						$mdToast.show($mdToast.simple({
							content: 'Warning items are missing!'
						}));
						return;
					}
					virtualMachine.launch(vm, authentication.token());
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
				action: layout.openDialog,
				params: 'vmCommand',
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