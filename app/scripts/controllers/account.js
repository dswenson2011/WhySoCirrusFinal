(function () {
	var app = angular.module('app');
	app.controller('AccountController', AccountCtrl);
	AccountCtrl.$inject = ['datastore', 'observer'];
	function AccountCtrl(datastore, observer) {
		var AccountCtrl = this;
		AccountCtrl.user = datastore.get('user');
		return AccountCtrl;
	};
})();