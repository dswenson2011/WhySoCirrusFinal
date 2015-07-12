(function () {
	angular.module('app.authentication', ['app.core'])
		.service('authentication', ['$http', '$mdDialog', '$q', 'observer', function ($http, $mdDialog, $q, observer) {
			var authentication = this;
			var _loggedIn = false;
			var _authenticated = false;
			var _token = undefined;
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
				loadingDialog();
				if (authentication.getToken() == undefined) {
					_authenticated = false;
					$mdDialog.hide();
					observer.notify('authentication');
					defer.reject();
				}
				$http.post('/login/authenticate', { token: authentication.getToken() })
					.success(function (data, status, headers, config) {
						_authenticated = true;
						observer.notify('authentication');
						defer.resolve();
					})
					.error(function (err) {
						_authenticated = false;
						observer.notify('authentication');
						$mdDialog.hide();
						errorDialog();
						defer.reject();
					});
				return defer.promise;
			};
			authentication.login = function () {
				var defer = $q.defer();
				var DialogController = function ($location, $http, $mdDialog, defer) {
					var DialogController = this;
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
								authentication.setToken(data.token);
								authentication.storeToken();
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
				};
				$mdDialog.show({
					templateUrl: 'views/partials/loginDialog.html',
					controller: DialogController,
					locals: {
						defer: defer
					}
				});
				return defer.promise;
			};
			authentication.logout = function () {
				authentication.setToken("");
				authentication.clearToken();
				_authenticated = false;
				_loggedIn = false;
				observer.notify('authentication');
			};
			return authentication;
		}]);
})();