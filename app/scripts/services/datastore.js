(function () {
	var app = angular.module('app.datastore', ['app.core']);
	app.service('datastore', datastore);
	datastore.$inject = ['$http', 'observer', '$rootScope', 'socket'];
	function datastore($http, observer, $rootScope, socket) {
		var datastore = this;
		var modelStorage = [];
		datastore.get = function (model, id) {
			$http.get('/api/' + model + '/' + id)
				.success(function (data, status, headers, config) {
					modelStorage[model + id] = data.data;
					observer.notify('datastore');
				})
				.error(function (err) {
					console.log(err);
					$rootScope.$broadcast('notification', {
						error: true,
						message: err
					});
				});
		};
		return datastore;
	};
})();