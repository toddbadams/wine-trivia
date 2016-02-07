(function() {
    'use strict';
    var
        TEMPLATE_PATH = 'app/locations/',
        DATA_PATH = 'app/locations/',
        ROUTES = [{
            name: 'locations',
            state: {
                url: '/locations',
                templateUrl: TEMPLATE_PATH + 'locations.html',
                controller: 'wtLocations',
                controllerAs: "vm",
                resolve: {
                    data: 'wtLocationsResolver'
                }
            }
        }];

    angular.module('wt.locations', ['ui.router', 'ngMaterial', 'uiGmapgoogle-maps', 'wt.config', 'wt.fileloader'])
        .constant('wtLocationsConfig', {
            routes: ROUTES,
            dataPath: DATA_PATH
        })
        .config(moduleConfig)
        .factory('wtLocationsResolver', wtLocationsResolver)
        .controller('wtLocations', LocationController);


    /**
     * Module configuration
     */
    moduleConfig.$inject = ['$stateProvider', 'wtConfig', 'wtLocationsConfig'];

    function moduleConfig($stateProvider, appConfig, moduleConfig) {
        moduleConfig.routes.forEach(function(route) {
            if (route.state.templateUrl) {
                route.state.templateUrl = appConfig.basePath + route.state.templateUrl;
            }
            $stateProvider.state(route.name, route.state);
        });
    }

    /**
     * Location controller data resolver
     */
    wtLocationsResolver.$inject = ['wtLocationsConfig', 'wtJsonLoader'];

    function wtLocationsResolver(wtLocationsConfig, wtJsonLoader) {
        return wtJsonLoader(wtLocationsConfig.dataPath);
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



})();