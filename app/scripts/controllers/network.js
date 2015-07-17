(function () {
	var app = angular.module('app');
	app.controller('networkController', networkCtrl);
	networkCtrl.$inject = ['layout'];
	function networkCtrl(layout) {
		var networkCtrl = this;
		networkCtrl.selected = [];
		layout.page('network');
		layout.newDialog('networkCreate', function () {
			console.log('Create new network adapter dialog');
		});
		layout.newDialog('networkDelete', function () {
			console.log('Delete selected network adapter dialog');
		});
		layout.tools([
			{
				action: layout.openDialog,
				params: 'networkCreate',
				icon: "add",
				tooltip: {
					message: "Create new network adapter",
					direction: "left"
				}
			},
			{
				action: layout.openDialog,
				params: 'networkDelete',
				icon: "delete",
				tooltip: {
					message: "Delete network adapter",
					direction: "left"
				}
			}
		]);
		return networkCtrl;
	};
})();