angular.module('WhySoCirrus').service('layout', function () {
	var layout = this
		, _page = ""
		, observerCallbacks = [];

	layout.registerObserverCallback = function (fn) {
		observerCallbacks.push(fn);
	};
	var notifyObservers = function () {
		angular.forEach(observerCallbacks, function (fn) {
			fn();
		})
	};

	layout.setPage = function (page) {
		_page = page;
		notifyObservers();
	};

	layout.getPage = function () {
		return _page;
	};

	return layout;
});