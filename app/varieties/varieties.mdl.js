(function() {
	'use strict';

	var
		TEMPLATE_PATH = 'app/varieties/',
		DATA_PATH = 'app/varieties/',
		ROUTES = [{
			name: 'varieties',
			state: {
				url: '/varieties',
				templateUrl: TEMPLATE_PATH + 'variety.html',
				controller: 'wtVarieties',
				controllerAs: "vm",
				resolve: {
					data: 'wtVarietiesResolver',
					locations: 'wtLocationsResolver'
				},
                data:{
                    menu:{
                        name: 'Grape Varieties'
                    }
                }
			}
		}];

	angular.module('wt.varieties', ['ngMaterial', 'wt.routes',
			'wt.config', 'wt.fileloader', 'wt.locations'
		])
		.constant('wtVarietiesConfig', {
			routes: ROUTES,
			dataPath: DATA_PATH,
		})
		.config(moduleConfig)
		.factory('wtVarietiesResolver', wtVarietiesResolver)
		.controller('wtVarieties', VarietyController);

	/**
	 * Module configuration
	 */
	moduleConfig.$inject = ['wtRouteProvider', 'wtVarietiesConfig'];

	function moduleConfig(wtRoutes, moduleConfig) {
		wtRoutes.$get().setRoutes(moduleConfig.routes);
	}


	/**
	 * Variety controller data resolver
	 */
	wtVarietiesResolver.$inject = ['wtJsonLoader', 'wtVarietiesConfig', 'wtLocationsResolver'];

	function wtVarietiesResolver(wtJsonLoader, moduleConfig, wtLocationsResolver) {
		return wtLocationsResolver.then(function(locations) {
			return wtJsonLoader(moduleConfig.dataPath)
				.then(function(data) {
					data.varieties = createVarieties(data.varieties, locations);
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
			vm.varieties = data.varieties;
			vm.variety = vm.varieties['CHA'];
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
	var createVarieties = (function() {
		var Variety = function(data, locations) {
				this.isWhite = data.color === 'WH'; // else it's red
				this.key = data.key;
				this.value = data.value; // this is the name
				this.blendKeys = data.blends;
				this.regions = createLocationsHash(data.premiumLocations, locations),
				this.tasting = data.tasting;
			},


			BlendVariety = function(data) { // data is of type Variety
				this.isWhite = data.isWhite;
				this.key = data.key;
				this.value = data.value; // this is the name
			};

		function addBlendVarieties(data) {
			if (!data || !angular.isObject(data) || Object.keys(data).length === 0) return;
			angular.forEach(data, function(item, key) {
				item.blends = createBlendVarieties(item, data);
				delete item.blendKeys;
			});
			return data;
		}

		function createBlendVarieties(currentVariety, allVarieties) {
			if (!currentVariety.blendKeys || !angular.isArray(currentVariety.blendKeys) || currentVariety.blendKeys.length === 0) return;
			var blends = {};
			currentVariety.blendKeys.forEach(function(blendKey) {
				var blend = allVarieties[blendKey],
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

		function createVarietiesHash(data, locations) {
			if (!data || !angular.isArray(data) || data.length === 0) return;
			var obj = {};
			data.forEach(function(item) {
				var itemModel = new Variety(item, locations);
				obj[itemModel.key] = itemModel;
			});
			addBlendVarieties(obj);
			return obj;
		}
		return createVarietiesHash;
	})();

})();