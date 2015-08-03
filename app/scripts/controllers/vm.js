(function () {
	var app = angular.module('app');
	app.controller('vmController', vmCtrl);
	vmCtrl.$inject = ['layout', '$mdBottomSheet', '$mdDialog', '$mdToast', '$scope'];
	function vmCtrl(layout, $mdBottomSheet, $mdDialog, $mdToast, $scope) {
		var vmCtrl = this;
		$scope.$on('$destroy', function () {
			layout.removeDialog('vmCreate');
			layout.removeDialog('vmCommand');
		});
		vmCtrl.selected = [];
		vmCtrl.vms = [];
		layout.page('virtual machines');
		layout.newDialog('vmCommand', function () {
			$mdDialog.show({
				templateUrl: 'views/partials/commandsVM.tmpl.html',
				controller: bottomCtrl
			});
			function bottomCtrl($scope) {
			};
		});
		layout.newDialog('vmCreate', function () {
			$mdBottomSheet.show({
				templateUrl: 'views/partials/createVM.tmpl.html',
				controller: bottomCtrl
			});
			bottomCtrl.$inject = ['$scope', 'virtualMachine', 'authentication'];
			function bottomCtrl($scope, virtualMachine, authentication) {
				$scope.launch = function (vm) {
					if (vm.name == undefined || vm.operatingSystem == undefined || vm.networkAdapter == undefined) {
						$mdToast.show($mdToast.simple({
							content: 'Warning items are missing!'
						}));
						return;
					}
					virtualMachine.launch(vm, authentication.token());
					$mdBottomSheet.hide();
				};
				$scope.close = function () {
					$mdBottomSheet.hide();
				};
			};
		});
		layout.tools([
			{
				action: layout.openDialog,
				params: 'vmCreate',
				icon: "add",
				tooltip: {
					message: "Create new VM",
					direction: "left"
				}
			},
			{
				action: layout.openDialog,
				params: 'vmCommand',
				icon: "delete",
				tooltip: {
					message: "Delete VM",
					direction: "left"
				}
			}
		]);
		return vmCtrl;
	};
})();