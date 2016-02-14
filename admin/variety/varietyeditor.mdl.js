(function() {
	'use strict'

	var
		TEMPLATE_PATH = 'app/varieties/',
		DATA_PATH = '/app/varieties/';

	angular.module('wt.varietyeditor', ['ngMaterial', 'wt.fileloader', 'wt.locations'])
		.controller('wtVarietyEditor', wtVarietyEditor)
		.filter('orderArryBy', function() {
			return function(input, attr) {
				if (!angular.isArray(input)) return input;

				input.sort(function(a, b) {
					return a[attr].localeCompare(b[attr])
				});
				return input;
			}
		})
		.config([
			'$compileProvider',
			function($compileProvider) {
				$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|blob):/);
			}
		]);

	wtVarietyEditor.$inject = ['$filter','wtJsonLoader', 'wtLocationsResolver'];

	function wtVarietyEditor($filter, wtJsonLoader, wtLocationsResolver) {
		var vm = this;

		function postDataLoad(data) {
			vm.varieties = $filter('orderArryBy')(data,'value');
			vm.current = data[0];
			updateDownload();
		}

		function postLocations(data){
			vm.locations = data;
		}

		function select(variety) {
			vm.current = variety;
		}

		function updateDownload() {
			var json = angular.toJson(vm.varieties), //JSON.stringify(vm.varieties),
				blob = new Blob([json], {
					type: "application/json"
				});
			vm.download = URL.createObjectURL(blob);
		}

		// controller activation
		(function() {
			vm.varieties = null;
			vm.current = null;
			vm.select = select;
			vm.download = null;
			vm.updateDownload = updateDownload;
			wtJsonLoader(DATA_PATH).then(postDataLoad);
			wtLocationsResolver.then(postLocations);
		}());
	}
})();