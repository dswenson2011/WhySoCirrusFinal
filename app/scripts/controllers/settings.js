(function () {
	var app = angular.module('app');
	app.controller('settingsController', SettingsCtrl);
	SettingsCtrl.$inject = ['datastore', 'observer'];
	function SettingsCtrl(datastore, observer) {
		var SettingsCtrl = this;
		SettingsCtrl.save = function (Model, Object) {
			datastore.update(Model, Object);
		};
		return SettingsCtrl;
	};
})();