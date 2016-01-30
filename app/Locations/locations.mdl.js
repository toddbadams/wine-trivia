(function () {
    'use strict';
    var 
    BASE_PATH = window.location.hostname === 'localhost' ? '' : '/wine-trivia',
    TEMPLATE_URL = BASE_PATH + '/app/locations/';

	angular.module('wt.locations', [
	        'ui.router'
	])
		.constant('wt.locations.config', {
	            routes: [{
	                name: 'locations',
	                state: {
	                    url: '/locations',
	                    templateUrl: TEMPLATE_URL + 'locations.html',
	                    controller: 'wtLocations',
	                    controllerAs: "vm" ,
	                    resolve:
	                    {
	                        data: 'wt.locations.controller.resolver'
	                    }
	                }
	            }],
	            dataUrl: BASE_PATH + '/app/locations/',
	 			locationsFileName: 'wset2'
	        })
	    .config(moduleConfig)
        .factory('wt.locations.controller.resolver', LocationControllerResolver)
        .factory('locationService', locationService)
        .controller('wtLocations', LocationController);


    /**
     * Module configuration
     */
    moduleConfig.$inject = ['$stateProvider',  'wt.locations.config'];
    function moduleConfig($stateProvider, config) {
        config.routes.forEach(function (route) {
            $stateProvider.state(route.name, route.state);
        });
    }


    /**
     * Location controller data resolver
     */
    LocationControllerResolver.$inject = ['locationService', 'wt.locations.config'];
    function LocationControllerResolver(locationService, config) {
        return locationService.getLocations(config.locationsFileName, config.numberLocations);
    }


    /**
     * Location controller
     */
    LocationController.$inject = ['data'];
    function LocationController(data) {
        var vm = this;

        function dataErrorCheck(data){
            // todo
            return data;
        }

        function selected(selectedIndex){
            vm.current.selections[selectedIndex].isWrong = !vm.current.selections[selectedIndex].isAnswer;
            vm.current.description = vm.current.selections[selectedIndex].description;
        }

        function previous(){
            if(vm.index > 0) {
                vm.index -= 1;
                showPrevNextButtons(); 
            }         
        }

        function next(){
            if(vm.index < vm.data.length - 1) {
                vm.index += 1;
                showPrevNextButtons();
            }          
        }

        function showPrevNextButtons(){
            vm.current = vm.data[vm.index]; 
            vm.showPrevious = vm.index > 0; 
            vm.showNext = vm.index < vm.data.length - 1; 
        }

        function isWrong(index){
            var w = vm.current.selected === index &&
                !vm.current.selections[index].isAnswer;
                return w;
        }

        // controller activation
        (function () {
            vm.data = dataErrorCheck(data);
            vm.index = 0;
            vm.current = vm.data[vm.index];
            vm.showResults = false;
            vm.showPrevious = false;
            vm.previous = previous;
            vm.showNext = true;
            vm.next = next;
            vm.selected = selected;
            vm.isWrong = isWrong;
            vm.tags = ['France','Bordeaux'];
            vm.tagsReadonly = true;
            vm.level = {
                filename: 'wset3',
                name: 'WSET 3'
            }
            vm.tags = 'France'
            window.foo = vm;
        })();
    }


    /**
     * Location service
     */
    locationService.$inject = ['$http', 'wt.locations.config'];
    function locationService($http, config) {
        var cache = [],
            publicApi = {
                getLocations: getLocations
            };

        function getLocations(name, qnty) {
            return getLocationsFromJsonFile(name);
        }

        function getLocationsFromJsonFile(name) {
            return $http.get(buildFilename(name))
                .then(function (result) {
                    return result.data;
                });
        }

        function buildFilename(name) {
            return config.dataUrl + name + '.json';
        }   

        return publicApi;
    }


})();