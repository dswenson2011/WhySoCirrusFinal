(function () {
	var app = angular.module('app.virtualMachine', ['app.core']);
	app.service('virtualMachine', virtualMachine);
	virtualMachine.$inject = ['observer', '$http'];
	function virtualMachine(observer, $http) {
		var virtualMachine = this;
		virtualMachine.launch = function (vm, token) {
			$http.post('/api/vm/launch', { vm: vm, token: token })
				.success(function (data, status, headers, config) {

				})
				.error(function (error) {

				});
		};
		return virtualMachine;
	};
})();