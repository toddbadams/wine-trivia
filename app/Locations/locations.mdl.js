(function() {
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
                    controllerAs: "vm",
                    resolve: {
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
    moduleConfig.$inject = ['$stateProvider', 'wt.locations.config'];

    function moduleConfig($stateProvider, config) {
        config.routes.forEach(function(route) {
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
    LocationController.$inject = ['uiGmapIsReady', 'data'];

    function LocationController(uiGmapIsReady, data) {
        var vm = this;

        function dataErrorCheck(data) {
            // todo
            return data;
        }

        function getTextSearchQuery() {
            var result = vm.country;
            return result;
        }

        function onCountryChange() {
            var index = parseInt(vm.country),
                country = vm.data.countries[index];
            vm.region = null;
            vm.subregion = null;
            vm.mapOptions.center.longitude = country.long;
            vm.mapOptions.center.latitude = country.lat;
            vm.mapOptions.zoom = country.zoom;
            vm.mapControl.refresh({
                latitude: vm.mapOptions.center.latitude,
                longitude: vm.mapOptions.center.longitude
            });
        }

        function onRegionChange() {
            vm.subregion = null;
            requestMapUpdate();
        }

        function onSubregionChange() {
            requestMapUpdate();
        }

        function requestMapUpdate() {
            vm.service.textSearch({
                query: getTextSearchQuery()
            }, updateMap);
        }

        function updateMap(result, status) {

        }



        // controller activation
        (function() {
            vm.data = dataErrorCheck(data);
            vm.country = null;
            vm.region = null;
            vm.subregion = null;
            vm.mapOptions = {
                center: {
                    latitude: 37,
                    longitude: 0
                },
                zoom: 4
            };
            vm.mapControl = {};
            vm.onCountryChange = onCountryChange;

            //data=!4m2!3m1!1s0x47f2043908f3d9b7:0x109ce34b30d2510
            vm.isReady = uiGmapIsReady;
            uiGmapIsReady.promise(1).then(function(instances) {
                instances.forEach(function(inst) {
                    vm.map = inst.map;
                    vm.uuid = vm.map.uiGmap_id;
                    vm.mapInstanceNumber = inst.instance; // Starts at 1.
                    vm.places = google.maps.places;
                    vm.service = new vm.places.PlacesService(vm.map);
                    vm.service.textSearch({
                        query: 'France'
                    }, updateMap);

                });
            });

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
                .then(function(result) {
                    return result.data;
                });
        }

        function buildFilename(name) {
            return config.dataUrl + name + '.json';
        }

        return publicApi;
    }


})();