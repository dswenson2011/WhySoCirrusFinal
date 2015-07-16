(function () {
	var app = angular.module('app.layout', ['app.core']);
	app.service('layout', ['$mdSidenav', '$mdToast', 'observer', 'socket', function ($mdSidenav, $mdToast, observer, socket) {
		var layout = this;
		var _page = undefined;
		var _tools = undefined;
		var _dialogs = [];
		socket.on('notifcation', function (data) {
			$mdToast.show($mdToast.simple({
				content: data.message,
				position: 'bottom right'
			}));
		});
		layout.newDialog = function (name, fn) {
			if (_dialogs[name] == undefined)
				_dialogs[name] = [];
			_dialogs[name].push(fn);
		};
		layout.openDialog = function (name) {
			console.log('open');
			angular.forEach(_dialogs[name], function (fn) {
				console.log(fn);
				fn();
			});
		};
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
		layout.tools = function (tools) {
			if (tools === undefined)
				return _tools;
			else
				_tools = tools;
			observer.notify('layout');
		};
		return layout;
	}]);
})();