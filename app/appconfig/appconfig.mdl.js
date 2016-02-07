(function() {
	'use strict';
	var
		BASE_PATH = window.location.hostname === 'localhost' ? window.location.origin +'/' : '/wine-trivia/';

	angular.module('wt.config', [])
		.constant('wtConfig', {
			basePath: BASE_PATH
		});
})();