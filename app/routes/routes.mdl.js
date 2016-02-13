(function() {
	'use strict';

	angular.module('wt.routes', ['ui.router', 'wt.config'])
		.factory('wtRoutes', wtRoutesService)
		.provider('wtRoute', wtRouteProvider);


	/**
	 * Wrapper service for page routing
	 */
	wtRouteProvider.$inject = ['$stateProvider', 'wtConfig'];

	function wtRouteProvider($stateProvider, appConfig) {
		this.$get = wtRoutes; 

		function wtRoutes() {
			var publicApi = {
				setRoutes: setRoutes
			}

			function setRoutes(routes) {
				if (!angular.isArray(routes)) {
					throw new Error();
				}
				routes.forEach(function(route) {
					if (route.state.templateUrl) {
						route.state.templateUrl = appConfig.basePath + route.state.templateUrl;
					}
					$stateProvider.state(route.name, route.state);
				});
			}

			return publicApi;
		}
	}

	wtRoutesService.$inject = ['$state'];
	function wtRoutesService($state){
		var publicApi = {
			getMenuItems: getMenuItems
		},
		menuItems = (function(){

			var MenuItem = function(data){
				this.name = data.params.menu.name;
				this.stateName = data.name;
			}
			MenuItem.prototype.go = function(){
				$state.go(this.stateName);
			}

			function createMenuItems(routes){
				if(!angular.isArray(routes) || routes.length<1){
					return [];
				}

				var results = [];
				routes.forEach(function(item){
					if(item && item.params && item.params.menu){
						results.push(new MenuItem(item));
					}
				});
				return results;
			}

			return createMenuItems;
		})();

		function getMenuItems(){
			return menuItems($state.get());
		}
		return publicApi
	}

})();