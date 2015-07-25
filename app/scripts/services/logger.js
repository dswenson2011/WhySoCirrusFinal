(function () {
	var app = angular.module('app.logger', []);
	app.service('logger', logger);
	logger.$inject = [];
	function logger() {
		var logger = this;
		return logger;
	}
})();