angular.module('WhySoCirrus').service('authenticationService', ['$http', '$mdDialog', '$q', function ($http, $mdDialog, $q) {
	var authentication = this;
	var loadingDialog = function () {
		return $mdDialog.show({
			clickOutsideToClose: false,
			escapeToClose: false,
			disableParentScroll: true,
			template: '<md-dialog><md-dialog-content><center>Authenticating<br/><md-progress-linear md-mode="indeterminate"></md-progress-linear></center></md-dialog-content></md-dialog>'
		});
	};

	var observersCallbacks = [];
	var notify = function () {
		angular.forEach(observersCallbacks, function (fn) {
			fn();
		});
	};
	authentication.registerObserverCallback = function (fn) {
		observersCallbacks.push(fn);
	}


	authentication._loggedIn = false;
	authentication._authenticated = false;

	authentication.isLoggedIn = function () {
		return authentication._loggedIn;
	}

	authentication.isAuthenticated = function () {
		return authentication._authenticated;
	};

	authentication.token = undefined;
	authentication.storeToken = function (token) {
		token = (typeof token === 'undefined') ? authentication.token : token;
		localStorage.setItem('token', token);
	};

	authentication.loadToken = function () {
		var tempToken = localStorage.getItem('token');
		if (tempToken != null)
			authentication.setToken(tempToken);
	};

	authentication.setToken = function (token) {
		authentication.token = token;
		notify();
	};

	authentication.getToken = function () {
		return authentication.token;
	}

	authentication.logout = function () {
		authentication.setToken("");
		authentication.storeToken();
		authentication._authenticated = false;
		authentication._loggedIn = false;
		notify();
	};

	authentication.login = function ($event) {
		var deferred = $q.defer();
		var parentEl = angular.element(document.body);
		var lDH = loadingDialog();
		$mdDialog.show({
			parent: parentEl,
			targetEvent: $event,
			preserveScope: true,
			templateUrl: 'views/partials/loginDialog.html',
			controller: DialogController,
			locals: {
				deferred: deferred
			}
		});
		$mdDialog.hide(lDH);
		function DialogController($scope, $location, $http, $mdDialog, deferred) {
			$scope.user = {
				username: "",
				password: "",
			};
			$scope.login = function () {
				$mdDialog.hide();
				var lDH = loadingDialog();
				$http.post('/login', $scope.user)
					.success(function (data, status, headers, config) {
						$mdDialog.hide(lDH);
						authentication.setToken(data.token);
						authentication.storeToken();
						authentication._error = false;
						authentication._loggedIn = true;
						authentication._authenticated = true;
						notify();
						deferred.resolve();
					})
					.error(function (data, status, headers, config) {
						$mdDialog.hide(lDH);
						authentication._error = true;
						authentication._loggedIn = false;
						authentication._authenticated = false;
						notify();
						deferred.reject('login');
					});
			};
			$scope.closeDialog = function () {
				$mdDialog.hide();
				deferred.reject();
			};
		};
		return deferred.promise;
	};
	
	// [TODO:David] Finish writing authentication against redis
	authentication.authenticate = function () {
		var defer = $q.defer();
		loadingDialog();

		if (authentication.token == undefined) {
			authentication._authenticated = false;
			$mdDialog.hide();
			notify()
			defer.reject();
		}

		$http.post('/login/authenticate', { token: authentication.token })
			.success(function (data, status, headers, config) {
				$mdDialog.hide();
				authentication._authenticated = true;
				notify();
				defer.resolve();
			}).error(function (data, status, headers, config) {
				authentication._authenticated = false;
				notify();
				$mdDialog.hide();
				defer.reject();
			});
		return defer.promise;
	};

	authentication.error = function () {
		$mdDialog.show({
			clickOutsideToClose: true,
			template: '<md-dialog>' +
			'<md-dialog-content>' +
			'<center>' +
			'<h2 style="font-variant:small-caps;">unauthorized<h2>' +
			'<ng-md-icon style="fill:rgba(237,110,110,1)" icon="lock_outline" size="64"></ng-md-icon>' +
			'</center>' +
			'</md-dialog-content>' +
			'</md-dialog>'
		});
	};

	return authentication;
}]);