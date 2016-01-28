(function () {
    'use strict';
    var 
    BASE_PATH = window.location.hostname === 'localhost' ? '' : '/wine-trivia',
    TEMPLATE_URL = BASE_PATH + '/app/variety/';

	angular.module('wt.variety', [
	        'wt.variety.controller'
	])
	.constant('wt.variety.config', {
	            routes: [{
	                name: 'variety',
	                state: {
	                    url: '/variety',
	                    templateUrl: TEMPLATE_URL + 'variety.html',
	                    controller: 'wtVariety',
	                    controllerAs: "vm"
	                    
	                }
	            }]
	        })
	        .config(moduleConfig);


    /**
     * Module configuration
     */
    moduleConfig.$inject = ['$stateProvider',  'wt.variety.config'];
    function moduleConfig($stateProvider, config) {
        config.routes.forEach(function (route) {
            $stateProvider.state(route.name, route.state);
        });
    }

})();