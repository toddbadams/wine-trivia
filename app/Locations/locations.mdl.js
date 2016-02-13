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
                },
                params:{
                    menu:{
                        name: 'Wine Regions'
                    }
                }
            }
        }],
        locationsCache = null;

    angular.module('wt.locations', ['ngMaterial', 'wt.routes', 'wt.config', 'wt.fileloader'])
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
    moduleConfig.$inject = ['wtRouteProvider', 'wtLocationsConfig'];

    function moduleConfig(wtRoutes, moduleConfig) {
        wtRoutes.$get().setRoutes(moduleConfig.routes);
    }

    /**
     * Location controller data resolver
     */
    wtLocationsResolver.$inject = ['wtLocationsConfig', 'wtJsonLoader'];

    function wtLocationsResolver(wtLocationsConfig, wtJsonLoader) {
        if (locationsCache === null) {
            locationsCache = wtJsonLoader(wtLocationsConfig.dataPath)
                .then(function(data) {
                    return createLocations(data);
                });
        }
        return locationsCache;
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


    var createLocations = (function() {

        var Location = function(data) {
            this.key = data.key;
            this.parentKey = parentKey(this.key);
            this.childKey = childKey(this.key);
            this.value = data.value; // The location name
            if (data.description) {
                this.description = data.description;
            }
            if (angular.isNumber(data.lat) &&
                angular.isNumber(data.long) &&
                angular.isNumber(data.zoom)) {
                this.lat = data.lat;
                this.lon = data.lon;
                this.zoom = data.zoom;
            }
        };

        /**
         * @param(key) is in the format 'FR-BUR-MAC'
         * @return and array of keys such as ['FR','BUR','MAC']
         */
        function parentKey(key) {
            if (!key) return [];
            var arr = key.split('-'),
                parentKey = null;
            arr.pop();
            arr.forEach(function(item, index, array) {
                parentKey = index === 0 ? item : parentKey + '-' + item;
            })
            return parentKey;
        }

        function childKey(key) {
            var lastIndexOf = key.lastIndexOf('-');
            return lastIndexOf > -1 ? key.substr(lastIndexOf + 1) : key;
        }

        function createLocationsHash(data) {
            if (!data || !angular.isArray(data) || data.length === 0) return;
            var obj = {};
            data.forEach(function(item) {
                var itemModel = new Location(item);
                obj[itemModel.key] = itemModel;
            });
            return obj;
        }

        return createLocationsHash;
    })();

})();