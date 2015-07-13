(function () {
	var app = angular.module('app.core', ['ngMaterial', 'ngMdIcons', 'ngMessages', 'ngRoute', 'btford.socket-io']);

	app.config(function ($mdThemingProvider) {
		$mdThemingProvider.theme('default')
			.primaryPalette('teal')
			.accentPalette('blue-grey');
	});

	// [TODO:David] rework socket factory as we might need to do forwards?
	app.factory('socket', function (socketFactory) {
		return socketFactory();
	});

	// Toast hooks for notifications
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