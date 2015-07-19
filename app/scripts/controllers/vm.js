(function () {
	var app = angular.module('app');
	app.controller('vmController', vmCtrl);
	vmCtrl.$inject = ['layout', '$mdBottomSheet', '$mdToast', '$scope'];
	function vmCtrl(layout, $mdBottomSheet, $mdToast, $scope) {
		var vmCtrl = this;
		$scope.$on('$destroy', function () {
			layout.removeDialog('vmCreate');
			layout.removeDialog('vmCommand');
		});
		vmCtrl.selected = [];
		vmCtrl.vms = [];
		layout.page('virtual machines');
		layout.newDialog('vmCommand', function () {
			$mdBottomSheet.show({
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
			bottomCtrl.$inject = ['$scope', 'virtualMachine'];
			function bottomCtrl($scope, virtualMachine) {
				$scope.launch = function (vm) {
					if (vm.name == undefined || vm.operatingSystem == undefined || vm.networkAdapter == undefined) {
						$mdToast.show($mdToast.simple({
							content: 'Warning items are missing!'
						}));
						return;
					}
					virtualMachine.launch(vm);
					vm.status = 'OFF';
					vmCtrl.vms.push(vm);
					$mdBottomSheet.hide();
				};
				$scope.close = function () {
					$mdBottomSheet.hide();
				};
			};
		});
		function Test(item) {
			console.log(item);
		};
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
		return vmCtrl;
	};
})();