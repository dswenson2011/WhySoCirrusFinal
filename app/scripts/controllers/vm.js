(function () {
	var app = angular.module('app');

	app.controller('vmController', vmCtrl);
	vmCtrl.$inject = ['layout', '$mdBottomSheet'];
	function vmCtrl(layout, $mdBottomSheet) {
		layout.page("Virtual Machines");
		layout.newDialog('vmCreate', function () {
			$mdBottomSheet.show({
				templateUrl: 'views/partials/createVM.tmpl.html',
				controller: bottomCtrl
			});
			function bottomCtrl($scope) {
				console.log('bottom sheet');
			};
		});
		layout.tools([
			{
				action: layout.openDialog,
				params: 'vmCreate',
				icon: "create",
				tooltip: {
					message: "Create new VM",
					direction: "left"
				}
			},
			{
				action: layout.openDialog,
				params: 'vmCreate',
				icon: "description",
				tooltip: {
					message: "View VM",
					direction: "left"
				}
			},
			{
				action: layout.openDialog,
				params: 'vmCreate',
				icon: "delete",
				tooltip: {
					message: "Delete VM",
					direction: "left"
				}
			}
		]);
	};
})();