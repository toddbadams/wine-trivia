(function() {
	'use strict';

	angular.module('wt.routes', ['wt.config'])
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

})();