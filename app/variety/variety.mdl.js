(function() {
	'use strict';
	var
		BASE_PATH = window.location.hostname === 'localhost' ? '' : '/wine-trivia',
		TEMPLATE_URL = BASE_PATH + '/app/variety/',
		ROUTES = [{
			name: 'variety',
			state: {
				url: '/variety',
				templateUrl: TEMPLATE_URL + 'variety.html',
				controller: 'wtVariety',
				controllerAs: "vm"

			}
		}];

	angular.module('wt.variety', [
			'ui.router',
			'ngMaterial'
		])
		.constant('wt.variety.config', {
			routes: ROUTES
		})
		.config(moduleConfig)
		.controller('wtVariety', VarietyController);


	/**
	 * Module configuration
	 */
	moduleConfig.$inject = ['$stateProvider', 'wt.variety.config'];

	function moduleConfig($stateProvider, config) {
		config.routes.forEach(function(route) {
			$stateProvider.state(route.name, route.state);
		});
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