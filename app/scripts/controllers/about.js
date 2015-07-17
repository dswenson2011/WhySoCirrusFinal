(function () {
	var app = angular.module('app');
	app.controller('aboutController', aboutCtrl);
	aboutCtrl.$inject = ['layout'];
	function aboutCtrl(layout) {
		layout.page("about");
		layout.tools("");
	};
})();