(function () {
	var app = angular.module('app');
	app.controller('storageController', storageCtrl);
	storageCtrl.$inject = ['layout', '$mdBottomSheet', '$mdToast'];
	function storageCtrl(layout, $mdBottomSheet, $mdToast) {
		var storageCtrl = this;
		layout.page('storage');
		layout.newDialog('storageCreate', function () {
			$mdBottomSheet.show({
				templateUrl: 'views/partials/createVD.tmpl.html',
				controller: bottomCtrl
			});
			bottomCtrl.$inject = ['$scope', 'virtualMachine'];
			function bottomCtrl($scope, virtualDisk) {
				$scope.launch = function (vhd) {
					if (vhd.name == undefined || vhd.operatingSystem == undefined) {
						$mdToast.show($mdToast.simple({
							content: 'Warning items are missing!'
						}));
						return;
					}
					virtualDisk.launch(vhd);
					storageCtrl.vhd.push(vhd);
					$mdBottomSheet.hide();
				};
				$scope.close = function () {
					$mdBottomSheet.hide();
				};
			};
		});
		layout.newDialog('storageDelete', function () {
			console.log('Delete selected storage disk dialog');
		});
		layout.tools([
			{
				action: layout.openDialog,
				params: 'storageCreate',
				icon: "add",
				tooltip: {
					message: "Create new storage disk",
					direction: "left"
				}
			},
			{
				action: layout.openDialog,
				params: 'storageDelete',
				icon: "delete",
				tooltip: {
					message: "Delete storage disk",
					direction: "left"
				}
			}
		]);
		return storageCtrl;
	};
})();