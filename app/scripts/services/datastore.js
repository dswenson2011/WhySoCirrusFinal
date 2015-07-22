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