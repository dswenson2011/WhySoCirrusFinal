(function () {
	var app = angular.module('app.virtualDisk', ['app.core']);
	app.service('virtualDisk', virtualDisk);
	virtualDisk.$inject = ['$http', '$q'];
	function virtualDisk($http, $q) {
		var virtualDisk = this;
		virtualDisk.launch = function (vd, token) {
			var defer = $q.defer();
			$http.post('/VD/Create', { vd: vd, token: token })
			.success(function(){
				defer.resolve();
			})
			.error(function(){
				defer.reject();
			});
			return defer.promise;
		};
		virtualDisk.findAll = function () {
			var defer = $q.defer();
			$http.get('/VD/')
				.success(function (data, status, headers, config) {
					defer.resolve(data);
				})
				.error(function (error) {
					defer.reject([]);
				});
			return defer.promise;
		};
		virtualDisk.delete = function (vd) { };
		return virtualDisk;
	};
})();