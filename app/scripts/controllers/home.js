(function () {
	var app = angular.module('app');
	app.controller('homeController', HomeCtrl);
	HomeCtrl.$inject = ['layout'];
	function HomeCtrl(layout) {
		layout.page('home');
		layout.tools('');
		var HomeCtrl = this;
		return HomeCtrl;
	};
})();