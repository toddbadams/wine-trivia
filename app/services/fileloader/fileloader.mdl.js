(function() {
	'use strict';

	angular.module('wt.fileloader', ['wt.config'])
		.factory('wtJsonLoader', jsonLoader);

	/**
	 * JSON file loader
	 */
	jsonLoader.$inject = ['$http', 'wtConfig']; 

	function jsonLoader($http, appConfig) {

		function getFromJsonFile(dataPath) {
			var settings = {
				level : 'wset3'
			};
			var fqFilename = appConfig.basePath + dataPath + settings.level + '.json';
			return $http.get(fqFilename)
				.then(function(result) {
					return result.data;
				});
		}

		return getFromJsonFile;
	}
})();