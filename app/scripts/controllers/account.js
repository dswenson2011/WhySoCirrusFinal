(function () {
	var app = angular.module('app');
	app.controller('accountController', AccountCtrl);
	AccountCtrl.$inject = ['authentication', 'datastore', 'layout', 'observer'];
	function AccountCtrl(authentication, datastore, layout, observer) {
		var AccountCtrl = this;
		AccountCtrl.query = {
			order: 'name',
			limit: 5,
			page: 1,
			filter: ''
		};
		AccountCtrl.filter = function (item, index) {
			return index >= (AccountCtrl.query.limit * (AccountCtrl.query.page - 1));
		};
		AccountCtrl.logs = [
			{ action: 'Create', item: 'Test VM', date: 'Mon Sep 28 1998 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM 3', date: 'Mon Sep 28 1999 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM 2', date: 'Mon Sep 28 1999 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM 3', date: 'Mon Sep 28 1999 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM 2', date: 'Mon Sep 28 1999 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM', date: 'Mon Sep 28 1998 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM 3', date: 'Mon Sep 28 1999 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM 2', date: 'Mon Sep 28 1999 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM', date: 'Mon Sep 28 1998 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM 2', date: 'Mon Sep 28 1999 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM', date: 'Mon Sep 28 1998 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM 3', date: 'Mon Sep 28 1999 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM 2', date: 'Mon Sep 28 1999 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM', date: 'Mon Sep 28 1998 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM 3', date: 'Mon Sep 28 1999 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM 2', date: 'Mon Sep 28 1999 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM', date: 'Mon Sep 28 1998 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM', date: 'Mon Sep 28 1998 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM 3', date: 'Mon Sep 28 1999 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM 2', date: 'Mon Sep 28 1999 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM', date: 'Mon Sep 28 1998 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM 3', date: 'Mon Sep 28 1999 14:36:22 GMT-0700', result: 'OK' },
			{ action: 'Create', item: 'Test VM 2', date: 'Mon Sep 28 1999 14:36:22 GMT-0700', result: 'OK' }
		];
		layout.page('account');
		layout.tools('');
		return AccountCtrl;
	};
})();