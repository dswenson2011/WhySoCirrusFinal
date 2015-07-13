(function () {
	var app = angular.module('app.datastore', ['app.core']);
	app.service('datastore', datastore);
	datastore.$inject = ['$http', 'observer', '$rootScope', 'socket'];
	function datastore($http, observer, $rootScope, socket) {
		var datastore = this;
		var modelStorage = [];
		datastore.storageLoad = function (mode, id) {
			return modelStorage[mode + id];
		}
		socket.on('updatedModel', function (data) {
			datastore.get(data.model, data.id);
		});
		datastore.get = function (model, id) {
			$http.get('/api/' + model + '/' + id)
				.success(function (data, status, headers, config) {
					modelStorage[model + id] = data;
					observer.notify('datastore');
				})
				.error(function (err) {
					console.log(err);
					$rootScope.$broadcast('notification', {
						error: true,
						message: "Model " + err
					});
				});
		};
		return datastore;
	};
})();