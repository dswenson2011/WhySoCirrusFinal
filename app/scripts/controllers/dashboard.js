(function () {
	var app = angular.module('app');
	app.controller('dashboardController', DashboardCtrl);
	DashboardCtrl.$inject = ['layout'];
	function DashboardCtrl(layout) {
		layout.page('dashboard');
		layout.tools('');
		var DashboardCtrl = this;
		return DashboardCtrl;
	};
})();