(function() {
	'use strict';

	var
		TEMPLATE_PATH = 'app/wines/',
		DATA_PATH = 'app/wines/',
		ROUTES = [{
			name: 'wines',
			state: {
				url: '/wines',
				templateUrl: TEMPLATE_PATH + 'variety.html',
				controller: 'wtwines',
				controllerAs: "vm",
				resolve: {
					data: 'wtwinesResolver',
					locations: 'wtLocationsResolver'
				}
			}
		}];

	angular.module('wt.wines', ['ui.router', 'ngMaterial',
			'wt.config', 'wt.fileloader', 'wt.locations'
		])
		.constant('wtwinesConfig', {
			routes: ROUTES,
			dataPath: DATA_PATH,
		})
		.config(moduleConfig)
		.factory('wtwinesResolver', wtwinesResolver)
		.controller('wtwines', VarietyController);

	/**
	 * Module configuration
	 */
	moduleConfig.$inject = ['wtRouteProvider', 'wtwinesConfig'];

	function moduleConfig(wtRoutes, moduleConfig) {
		wtRoutes.$get().setRoutes(moduleConfig.routes);
	}


	/**
	 * Variety controller data resolver
	 */
	wtwinesResolver.$inject = ['wtJsonLoader', 'wtwinesConfig', 'wtLocationsResolver'];

	function wtwinesResolver(wtJsonLoader, moduleConfig, wtLocationsResolver) {
		return wtLocationsResolver.then(function(locations) {
			return wtJsonLoader(moduleConfig.dataPath)
				.then(function(data) {
					data.wines = createwines(data.wines, locations);
					return data;
				});
		});
	}

	/**
	 * variety controller
	 */
	VarietyController.$inject = ['data', 'locations'];

	function VarietyController(data, locations) {
		var vm = this;

		// controller activation
		(function() {
			vm.countries = locations.countries;
			vm.regions = locations.regions;
			vm.wines = data.wines;
			vm.variety = vm.wines['CHA'];
			vm.wines = data.wines;

			vm.selected = [];
			vm.toggle = function(item, list) {
				var idx = list.indexOf(item.key);
				if (idx > -1) list.splice(idx, 1);
				else list.push(item.key);
			};
			vm.exists = function(item, list) {
				return list.indexOf(item.key) > -1;
			};
			window.foo = vm.variety;
		})();
	}


	// PRIVATE METHODS
	var createwines = (function() {
		var Variety = function(data, locations) {
				this.isWhite = data.color === 'WH'; // else it's red
				this.key = data.key;
				this.value = data.value; // this is the name
				this.blendKeys = data.blends;
				this.premiumLocations = createLocationsHash(data.premiumLocations, locations)
			},


			BlendVariety = function(data) { // data is of type Variety
				this.isWhite = data.isWhite;
				this.key = data.key;
				this.value = data.value; // this is the name
			};

		function addBlendwines(data) {
			if (!data || !angular.isObject(data) || Object.keys(data).length === 0) return;
			angular.forEach(data, function(item, key) {
				item.blends = createBlendwines(item, data);
				delete item.blendKeys;
			});
			return data;
		}

		function createBlendwines(currentVariety, allwines) {
			if (!currentVariety.blendKeys || !angular.isArray(currentVariety.blendKeys) || currentVariety.blendKeys.length === 0) return;
			var blends = {};
			currentVariety.blendKeys.forEach(function(blendKey) {
				var blend = allwines[blendKey],
					blendModel = blend ? new BlendVariety(blend) : null;
				if (blendModel) {
					blends[blendModel.key] = blendModel;
				}
			});
			return blends;
		}

		function createLocationsHash(locationKeys, locations) {
			if (!locationKeys || !angular.isArray(locationKeys) || locationKeys.length === 0) return;
			var varietyLocations = {};
			locationKeys.forEach(function(key) {
				if (locations[key]) {
					varietyLocations[key] = angular.copy(locations[key]);
				}
			});
			// create hashed object
			var root = {};
			locationKeys.forEach(function(itemKey, index, array) {
				var curObj = angular.copy(varietyLocations[itemKey]),
					parentKey = curObj.parentKey;
				while (parentKey !== null) {
					var parObj = angular.copy(locations[parentKey])
					parObj.children = [];
					parObj.children.push(curObj);
					curObj = parObj;
					parentKey = curObj.parentKey;
				}
				root = angular.extend(root,curObj);
			});
			return varietyLocations;
		}

		function createwinesHash(data, locations) {
			if (!data || !angular.isArray(data) || data.length === 0) return;
			var obj = {};
			data.forEach(function(item) {
				var itemModel = new Variety(item, locations);
				obj[itemModel.key] = itemModel;
			});
			addBlendwines(obj);
			return obj;
		}
		return createwinesHash;
	})();

})();