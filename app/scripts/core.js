(function () {
	var app = angular.module('app.core', ['ngMaterial', 'ngMdIcons', 'ngMessages', 'ngRoute', 'angular-md5', 'btford.socket-io', 'md.data.table']);
	app.config(['$mdThemingProvider', function ($mdThemingProvider) {
		$mdThemingProvider.theme('default')
			.primaryPalette('deep-purple')
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