(function () {
	var app = angular.module('app.layout', ['app.core']);
	app.service('layout', ['$mdSidenav', '$mdToast', 'observer', 'socket', function ($mdSidenav, $mdToast, observer, socket) {
		var layout = this;
		var _page = undefined;
		socket.on('notifcation', function (data) {
			$mdToast.show($mdToast.simple({
				content: data.message,
				position: 'bottom right'
			}));
		});
		layout.onSwipeLeft = function (sidenav) { sidenav.open(); };
		layout.onSwipeRight = function (sidenav) { sidenav.close(); };
		layout.toggleSidenav = function (sidenav) { sidenav.toggle(); };
		layout.page = function (page) {
			if (page === undefined)
				return _page;
			else
				_page = page;
			observer.notify('layout');
		};
		return layout;
	}]);
})();