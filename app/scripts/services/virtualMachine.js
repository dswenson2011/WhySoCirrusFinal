(function () {
	var app = angular.module('app.virtualMachine', ['app.core']);
	app.service('virtualMachine', virtualMachine);
	virtualMachine.$inject = ['observer', 'datastore', 'authentication', 'layout', '$http'];
	function virtualMachine(observer, datastore, authentication, layout, $http) {
		var virtualMachine = this;
		virtualMachine.launch = function (vm) {
			datastore.create('virtualMachine', vm);
			console.log(vm);
		};
		return virtualMachine;
	};
})();