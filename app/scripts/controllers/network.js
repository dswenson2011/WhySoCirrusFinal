// [TODO:David] Add authentication service to pass token into virtualSwitch service
(function () {
	var app = angular.module('app');
	app.controller('networkController', networkCtrl);
	networkCtrl.$inject = ['layout', '$scope', '$mdBottomSheet', '$mdToast', 'virtualSwitch'];
	function networkCtrl(layout, $scope, $mdBottomSheet, $mdToast, virtualSwitch) {
		var networkCtrl = this;
		networkCtrl.vss = [];
		virtualSwitch.findAll().then(function (data) { networkCtrl.vss = data }, function (data) { networkCtrl.vss = data });
		networkCtrl.query = {
			order: 'Name',
			limit: 5,
			page: 1,
			filter: ''
		};
		networkCtrl.filter = function (item, index) {
			return index >= (networkCtrl.query.limit * (networkCtrl.query.page - 1));
		};
		networkCtrl.selected = [];
		$scope.$on('$destroy', function () {
			layout.removeDialog('networkCreate');
			layout.removeDialog('networkDelete');
		});
		layout.page('network');
		layout.newDialog('networkCreate', function () {
			$mdBottomSheet.show({
				templateUrl: 'views/partials/createVS.tmpl.html',
				controller: bottomCtrl
			});
			bottomCtrl.$inject = ['$scope', 'virtualSwitch'];
			function bottomCtrl($scope, virtualSwitch) {
				$scope.launch = function (vs) {
					if (vs.Name == undefined || vs.SwitchType == undefined) {
						$mdToast.show($mdToast.simple({
							content: 'Warning items are missing!'
						}));
						return;
					}
					virtualSwitch.launch(vs);
					virtualSwitch.findAll().then(function (data) { networkCtrl.vss = data }, function (data) { networkCtrl.vss = data });
					$mdBottomSheet.hide();
				};
				$scope.close = function () {
					$mdBottomSheet.hide();
				};
			};
		});
		layout.newDialog('networkDelete', function () {
			angular.forEach(networkCtrl.selected, function (item) {
				virtualSwitch.delete(item).then(function () {
					virtualSwitch.findAll().then(function (data) { networkCtrl.vss = data }, function (data) { networkCtrl.vss = data });
				}, function () {
					$mdToast.show($mdToast.simple({
						content: 'Failed to delete ' + item.Name
					}));
				});
			});
		});
		layout.tools([
			{
				action: layout.openDialog,
				params: 'networkCreate',
				icon: "add",
				tooltip: {
					message: "Create new network switch",
					direction: "left"
				}
			},
			{
				action: layout.openDialog,
				params: 'networkDelete',
				icon: "delete",
				tooltip: {
					message: "Delete network switch",
					direction: "left"
				}
			}
		]);
		return networkCtrl;
	};
})();