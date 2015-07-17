(function () {
	var app = angular.module('app.hyperv', ['app.core']);
	app.service('hyperv', hyperv);
	hyperv.$inject = ['observer'];
	function hyperv(observer) {
		var hyperv = this;
		hyperv.launch = function (vm) {
			
		};
		return hyperv;
	};
})();