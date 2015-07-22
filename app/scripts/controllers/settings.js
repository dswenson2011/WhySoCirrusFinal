(function () {
	var app = angular.module('app');
	app.controller('settingsController', SettingsCtrl);
	SettingsCtrl.$inject = ['authentication', 'datastore', 'layout', 'observer'];
	function SettingsCtrl(authentication, datastore, layout, observer) {
		var SettingsCtrl = this;
		layout.page('settings');
		layout.tools('');
		SettingsCtrl.save = function (Model, Object) {
			datastore.update(Model, Object, authentication.token());
		};
		return SettingsCtrl;
	};
})();