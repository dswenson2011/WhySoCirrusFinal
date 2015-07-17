(function () {
	var app = angular.module('app');
	app.controller('storageController', storageCtrl);
	storageCtrl.$inject = ['layout'];
	function storageCtrl(layout) {
		var storageCtrl = this;
		layout.page('storage');
		layout.tools('');
		return storageCtrl;
	};
})();