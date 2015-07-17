(function () {
	var app = angular.module('app');
	app.controller('faqController', faqCtrl);
	faqCtrl.$inject = ['layout'];
	function faqCtrl(layout) {
		var faqCtrl = this;
		layout.page('F.A.Q');
		layout.tools('');
		return faqCtrl;
	};
})();