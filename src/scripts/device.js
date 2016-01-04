define(function () {
	// private variables
	var ua = window.navigator.userAgent.toLowerCase();

	// private functions
	function isMobile() {
		return ua.search(/(i(pod|pad|phone)|android)/) !== -1;
	}
	function isTouch() {
		var isAvailable = 'ontouchstart' in window;

		// on some versions and configurations of IE on desktop touch feature is detected not correctly
		if (window.navigator.msPointerEnabled) {
			// desktop will not have touch points
			isAvailable = (navigator.msMaxTouchPoints > 0);
		}
		return isAvailable;
	}

	return {
		'isMobile': isMobile(),
		'isTouch': isTouch()
	};
});
