(function() {
	'use strict';
	
	var
		TEMPLATE_PATH = 'app/questions/',
		DATA_PATH = 'app/questions/',
		ROUTES = [{
			name: 'variety',
			state: {
				url: '/varieties',
				templateUrl: TEMPLATE_PATH + 'variety.html',
				controller: 'wtVarieties',
				controllerAs: "vm"

			}
		}];

	angular.module('wt.varieties', ['ui.router', 'ngMaterial', 'wt.config', 'wt.fileloader'])
		.constant('wtVarietiesConfig', {
			routes: ROUTES
		})
		.config(moduleConfig)
		.controller('wtVarieties', VarietyController);

	/**
	 * Module configuration
	 */
	moduleConfig.$inject = ['wtRouteProvider', 'wtVarietiesConfig'];

    function moduleConfig(wtRoutes, moduleConfig) {
        wtRoutes.$get().setRoutes(moduleConfig.routes);
    }

	/**
	 * variety controller
	 */
	VarietyController.$inject = [];

	function VarietyController() {
		var vm = this;

		// controller activation
		(function() {
			vm.countries = [
				"Argentina",
				"Australia",
				"Austria",
				"Chile",
				"France",
				"Germany",
				"Italy",
				"New Zealand",
				"Portugal",
				"Spain",
				"South Africa",
				"USA"
			];
			vm.variety = 'Premium Chardonnay';

			vm.selected = [];
			vm.toggle = function(item, list) {
				var idx = list.indexOf(item);
				if (idx > -1) list.splice(idx, 1);
				else list.push(item);
			};
			vm.exists = function(item, list) {
				return list.indexOf(item) > -1;
			};
		})();
	}

})();