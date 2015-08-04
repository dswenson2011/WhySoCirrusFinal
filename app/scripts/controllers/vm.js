(function () {
	var app = angular.module('app');
	app.controller('vmController', vmCtrl);
	vmCtrl.$inject = ['layout', '$mdBottomSheet', '$mdDialog', '$mdToast', '$scope', 'virtualMachine'];
	function vmCtrl(layout, $mdBottomSheet, $mdDialog, $mdToast, $scope, virtualMachine) {
		var vmCtrl = this;
		$scope.$on('$destroy', function () {
			layout.removeDialog('vmCreate');
			layout.removeDialog('vmCommand');
		});
		vmCtrl.query = {
			order: 'Name',
			limit: 5,
			page: 1,
			filter: ''
		};
		vmCtrl.filter = function (item, index) {
			return index >= (vmCtrl.query.limit * (vmCtrl.query.page - 1));
		};
		vmCtrl.selected = [];
		virtualMachine.findAll().then(function (data) { vmCtrl.vms = data; }, function (err) { vmCtrl.vms = err });
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
			bottomCtrl.$inject = ['$scope', 'virtualMachine', 'virtualSwitch', 'virtualDisk', 'authentication'];
			function bottomCtrl($scope, virtualMachine, virtualSwitch, virtualDisk, authentication) {
				virtualDisk.findAll().then(function (data) { $scope.VDs = data; }, function (error) { $scope.VDs = error; });
				virtualSwitch.findAll().then(function (data) { $scope.VSs = data; }, function (error) { $scope.VSs = error });
				$scope.launch = function (vm) {
					if (vm.name == undefined || vm.operatingSystem == undefined || vm.networkAdapter == undefined) {
						$mdToast.show($mdToast.simple({
							content: 'Warning items are missing!'
						}));
						return;
					}
					virtualMachine.launch(vm, authentication.token());
					virtualMachine.findAll().then(function (data) { vmCtrl.vms = data; }, function (err) { vmCtrl.vms = err });
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