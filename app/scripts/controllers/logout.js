(function () {
	var app = angular.module('app');
	app.controller('logoutController', LogoutCtrl);
	LogoutCtrl.$inject = ['$location', 'authentication', 'layout'];
	function LogoutCtrl($location, authentication, layout) {
		var LogoutCtrl = this;
		layout.page('Logout');
		layout.tools('');
		authentication.logout();
		$location.path('/');
		return LogoutCtrl;
	};
})();