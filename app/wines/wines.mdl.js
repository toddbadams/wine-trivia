(function() {
	'use strict';

	var
		TEMPLATE_PATH = 'app/wines/',
		DATA_PATH = 'app/wines/',
		ROUTES = [{
			name: 'wines',
			state: {
				url: '/wines',
				templateUrl: TEMPLATE_PATH + 'wine.html',
				controller: 'wtWines',
				controllerAs: "vm",
	//			resolve: {
	//				data: 'wtWinesResolver'
	//			},
                data:{
                    menu:{
                        name: 'Wines'
                    }
                }
			}
		}];

	angular.module('wt.wines', ['ngMaterial', 'wt.routes', 'wt.config', 'wt.fileloader'])
		.constant('wtWinesConfig', {
			routes: ROUTES,
			dataPath: DATA_PATH,
		})
		.config(moduleConfig)
		//.factory('wtWinesResolver', wtWinesResolver)
		.controller('wtWines', WineController);

	/**
	 * Module configuration
	 */
	moduleConfig.$inject = ['wtRouteProvider', 'wtWinesConfig'];

	function moduleConfig(wtRoutes, moduleConfig) {
		wtRoutes.$get().setRoutes(moduleConfig.routes);
	}


	/**
	 * Wine controller data resolver
	 */
	wtWinesResolver.$inject = []; // 'wtJsonLoader', 'wtWinesConfig']; //, 'wtLocationsResolver'];

	function wtWinesResolver(wtJsonLoader, moduleConfig, wtLocationsResolver) {
		return [];
	//	return wtLocationsResolver.then(function(locations) {
//			return wtJsonLoader(moduleConfig.dataPath)
//				.then(function(data) {
//					data.wines = createwines(data.wines, locations);
//					return data;
//				});
//		});
	}

	/**
	 * wine controller
	 */
	WineController.$inject = []; //'data']; //, 'locations'];

	function WineController(data, locations) {
		var vm = this;

		// controller activation
		(function() {
			vm.countries = locations.countries;
			vm.regions = locations.regions;
			vm.wines = data.wines;
			vm.wine = vm.wines['CHA'];
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
			window.foo = vm.wine;
		})();
	}


	// PRIVATE METHODS
	var createwines = (function() {
		var Wine = function(data, locations) {
				this.isWhite = data.color === 'WH'; // else it's red
				this.key = data.key;
				this.value = data.value; // this is the name
				this.blendKeys = data.blends;
				this.premiumLocations = createLocationsHash(data.premiumLocations, locations)
			},


			BlendWine = function(data) { // data is of type Wine
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

		function createBlendwines(currentWine, allwines) {
			if (!currentWine.blendKeys || !angular.isArray(currentWine.blendKeys) || currentWine.blendKeys.length === 0) return;
			var blends = {};
			currentWine.blendKeys.forEach(function(blendKey) {
				var blend = allwines[blendKey],
					blendModel = blend ? new BlendWine(blend) : null;
				if (blendModel) {
					blends[blendModel.key] = blendModel;
				}
			});
			return blends;
		}

		function createLocationsHash(locationKeys, locations) {
			if (!locationKeys || !angular.isArray(locationKeys) || locationKeys.length === 0) return;
			var wineLocations = {};
			locationKeys.forEach(function(key) {
				if (locations[key]) {
					wineLocations[key] = angular.copy(locations[key]);
				}
			});
			// create hashed object
			var root = {};
			locationKeys.forEach(function(itemKey, index, array) {
				var curObj = angular.copy(wineLocations[itemKey]),
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
			return wineLocations;
		}

		function createwinesHash(data, locations) {
			if (!data || !angular.isArray(data) || data.length === 0) return;
			var obj = {};
			data.forEach(function(item) {
				var itemModel = new Wine(item, locations);
				obj[itemModel.key] = itemModel;
			});
			addBlendwines(obj);
			return obj;
		}
		return createwinesHash;
	})();

})();