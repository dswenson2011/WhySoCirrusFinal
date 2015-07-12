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
		layout.onSwipeLeft = function (sidenav) { $mdSidenav(sidenav).open(); };
		layout.onSwipeRight = function (sidenav) { $mdSidenav(sidenav).close(); };
		layout.toggleSidenav = function (sidenav) { $mdSidenav(sidenav).toggle(); };
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