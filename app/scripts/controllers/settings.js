(function () {
	var app = angular.module('app');
	app.controller('settingsController', SettingsCtrl);
	SettingsCtrl.$inject = ['datastore', 'layout', 'observer'];
	function SettingsCtrl(datastore, layout, observer) {
		var SettingsCtrl = this;
		layout.page('settings');
		layout.tools('');
		SettingsCtrl.save = function (Model, Object) {
			datastore.update(Model, Object);
		};
		return SettingsCtrl;
	};
})();