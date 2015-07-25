(function () {
	var app = angular.module('app');
	app.controller('MainController', mainCtrl);
	mainCtrl.$inject = ['authentication', 'datastore', 'layout', '$location', 'md5', '$scope', 'observer'];
	function mainCtrl(authentication, datastore, layout, $location, md5, $scope, observer) {
		var mainCtrl = this;
		mainCtrl.hash = function (item) {
			return md5.createHash(item || '');
		};
		var userID;
		observer.register('authentication', function () {
			userID = authentication.id();
			datastore.get('User', userID);
		});
		observer.register('datastore', function () {
			mainCtrl.user = datastore.storageLoad('User', userID);
			mainCtrl.user.groupList = function (input) {
				var newInput = [];
				angular.forEach(input, function (item) {
					if (item != "") newInput.push(item);
				});
				return newInput;
			} (mainCtrl.user.groupList);
			if (mainCtrl.user.groupList == 'guest') {
				$scope.$emit('notification', { error: true, message: "You are on a guest account" });
			}
		});
		observer.register('authentication', function () {
			mainCtrl._authenticated = authentication.isAuthenticated();
		});
		observer.register('layout', function () {
			mainCtrl.title = layout.page().capitalizeFirstLetter();
		});
		observer.register('layout', function () {
			mainCtrl.tools = layout.tools();
		});
		mainCtrl.layout = layout;
		mainCtrl.traverse = function (link) {
			$location.path(link);
			layout.toggleSidenav('left');
		};
		mainCtrl.mainMenu = [
			{
				link: '/',
				title: 'Home',
				icon: 'home'
			},
			{
				link: '/about',
				title: 'About',
				icon: 'info_outline'
			},
			{
				link: '/faq',
				title: 'F.A.Q',
				icon: 'question_answer'
			},
			{
				link: '/dashboard',
				title: 'Dashboard',
				icon: 'dashboard'
			}
		];
		mainCtrl.managementMenu = [
			{
				link: '/account',
				title: 'Account',
				icon: 'account_circle'
			},
			{
				link: '/network',
				title: 'Network',
				icon: 'public'
			},
			{
				link: '/storage',
				title: 'storage',
				icon: 'storage'
			},
			{
				link: '/vm',
				title: 'Virtual Machines',
				icon: 'cloud_circle'
			},
			{
				link: '/settings',
				title: 'Settings',
				icon: 'settings'
			},
			{
				link: '/logout',
				title: 'Logout',
				icon: 'logout',
			}
		];

		return mainCtrl;
	};
})();