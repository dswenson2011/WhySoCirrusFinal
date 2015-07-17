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