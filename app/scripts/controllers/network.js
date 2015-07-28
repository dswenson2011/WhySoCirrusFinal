(function () {
	var app = angular.module('app');
	app.controller('networkController', networkCtrl);
	networkCtrl.$inject = ['layout', '$scope', '$mdBottomSheet', '$mdToast'];
	function networkCtrl(layout, $scope, $mdBottomSheet, $mdToast) {
		var networkCtrl = this;
		$scope.$on('$destroy', function () {
			layout.removeDialog('networkCreate');
			layout.removeDialog('networkDelete');
		});
		networkCtrl.selected = [];
		layout.page('network');
		layout.newDialog('networkCreate', function () {
			$mdBottomSheet.show({
				templateUrl: 'views/partials/createVS.tmpl.html',
				controller: bottomCtrl
			});
			bottomCtrl.$inject = ['$scope', 'virtualMachine'];
			function bottomCtrl($scope, virtualSwitch) {
				$scope.launch = function (vs) {
					if (vs.name == undefined || vs.type == undefined) {
						$mdToast.show($mdToast.simple({
							content: 'Warning items are missing!'
						}));
						return;
					}
					virtualSwitch.launch(vs);
					networkCtrl.vss.push(vs);
					$mdBottomSheet.hide();
				};
				$scope.close = function () {
					$mdBottomSheet.hide();
				};
			};
		});
		layout.newDialog('networkDelete', function () {
			console.log('Delete selected network switch dialog');
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