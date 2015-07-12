(function () {
	angular.module('app.datastore', ['app.core'])
		.service('datastore', ['socket', function (socket) {
			var datastore = this;

			socket.on('', function () { });

			return datastore;
		}]);
})();