(function () {
	var app = angular.module('app');
	app.controller('accountController', AccountCtrl);
	AccountCtrl.$inject = ['datastore', 'layout', 'observer'];
	function AccountCtrl(datastore, layout, observer) {
		var AccountCtrl = this;
		AccountCtrl.logs = [
			{ action: 'Create', item: 'Test VM', date: 'Mon Sep 28 1998 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM 3', date: 'Mon Sep 28 1999 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM 2', date: 'Mon Sep 28 1999 14:36:22 GMT-0700', result: 'OK' }
		];
		layout.page('account');
		layout.tools('');
		return AccountCtrl;
	};
})();