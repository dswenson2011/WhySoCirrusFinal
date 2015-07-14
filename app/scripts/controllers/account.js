(function () {
	var app = angular.module('app');
	app.controller('accountController', AccountCtrl);
	AccountCtrl.$inject = ['datastore', 'observer'];
	function AccountCtrl(datastore, observer) {
		var AccountCtrl = this;
		AccountCtrl.user = datastore.get('user', '1');
		return AccountCtrl;
	};
})();