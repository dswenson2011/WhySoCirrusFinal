(function () {
	var app = angular.module('app');
	app.controller('storageController', storageCtrl);
	storageCtrl.$inject = ['layout', '$scope', '$mdBottomSheet', '$mdToast', 'virtualDisk'];
	function storageCtrl(layout, $scope, $mdBottomSheet, $mdToast, virtualDisk) {
		var storageCtrl = this;
		virtualDisk.findAll().then(function (data) { storageCtrl.vhds = data; }, function (data) { storageCtrl.vhds = data; });
		storageCtrl.selected = [];
		storageCtrl.query = {
			order: 'Name',
			limit: 5,
			page: 1,
			filter: ''
		};
		storageCtrl.filter = function (item, index) {
			return index >= (storageCtrl.query.limit * (storageCtrl.query.page - 1));
		};
		$scope.$on('$destroy', function () {
			layout.removeDialog('storageCreate');
			layout.removeDialog('storageDelete');
		});
		layout.page('storage');
		layout.newDialog('storageCreate', function () {
			$mdBottomSheet.show({
				templateUrl: 'views/partials/createVD.tmpl.html',
				controller: bottomCtrl
			});
			bottomCtrl.$inject = ['$scope', 'virtualDisk'];
			function bottomCtrl($scope, virtualDisk) {
				$scope.launch = function (vhd) {
					if (vhd.name == undefined || vhd.operatingSystem == undefined) {
						$mdToast.show($mdToast.simple({
							content: 'Warning items are missing!'
						}));
						return;
					}
					virtualDisk.launch(vhd);
					virtualDisk.findAll().then(function (data) { storageCtrl.vhds = data; }, function (data) { storageCtrl.vhds = data; });
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