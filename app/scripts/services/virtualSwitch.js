(function () {
	var app = angular.module('app.virtualSwitch', ['app.core']);
	app.service('virtualSwitch', virtualSwitch);
	virtualSwitch.$inject = ['observer', '$http'];
	function virtualSwitch(observer, $http) {
		var virtualSwitch = this;
		virtualSwitch.launch = function (vs, token) {
			$http.post('/api/vs/launch', { vs: vs, token: token })
				.success(function (data, status, headers, config) {
					
				})
				.error(function (error) {

				});
		};
		return virtualSwitch;
	};
})();