(function () {
    'use strict';
    var
		TEMPLATE_PATH = 'app/home/',
		DATA_PATH = 'app/home/',
		ROUTES = [{
		    name: 'home',
		    state: {
		        url: '/',
		        templateUrl: TEMPLATE_PATH + 'home.html',
		        controller: 'wtHome',
		        controllerAs: "vm"
		    }
		}];

    angular.module('wt.home', ['ngMaterial', 'wt.routes'])
		.constant('wtHomeConfig', {
		    routes: ROUTES,
		    dataPath: DATA_PATH
		})
		.config(moduleConfig)
		.controller('wtHome', HomeController);


    /**
	 * Module configuration
	 */
    moduleConfig.$inject = ['wtRouteProvider', 'wtHomeConfig'];

    function moduleConfig(wtRoutes, moduleConfig) {
        wtRoutes.$get().setRoutes(moduleConfig.routes);
    }
    /**
	 * Home controller
	 */
    HomeController.$inject = [];

    function HomeController() {
        var vm = this;

       
        // controller activation
        (function () {
            
        })();
    }

})();