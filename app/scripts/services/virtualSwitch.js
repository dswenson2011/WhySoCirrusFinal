(function () {
	var app = angular.module('app.virtualSwitch', ['app.core']);
	app.service('virtualSwitch', virtualSwitch);
	virtualSwitch.$inject = ['observer', '$http', '$q'];
	function virtualSwitch(observer, $http, $q) {
		var virtualSwitch = this;
		virtualSwitch.launch = function (vs, token) {
			$http.post('/VS/Create', { vs: vs, token: token })
				.success(function (data, status, headers, config) {
					console.log(data);
				})
				.error(function (error) {
					console.log(error);
				});
		};
		virtualSwitch.delete = function (vs, token) {
			var defer = $q.defer();
			console.log(vs);
			$http.delete('/VS/Delete/' + vs.Id, { token: token })
				.success(function () {
					defer.resolve();
				})
				.error(function () {
					defer.reject();
				});
			return defer.promise;
		};
		virtualSwitch.findAll = function () {
			var defer = $q.defer();
			$http.get('/VS/')
				.success(function (data, status, headers, config) {
					defer.resolve(data);
				})
				.error(function (error) {
					console.log(error);
					defer.reject([]);
				});
			return defer.promise;
		};
		return virtualSwitch;
	};
})();