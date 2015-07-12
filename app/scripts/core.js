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

	app.service('observer', function () {
		var observer = this;
		var observerCallbacks = [];
		observer.register = function (service, callback) {
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