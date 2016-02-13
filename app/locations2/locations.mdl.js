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
                    locations: 'wtLocationsResolver'
                },
                data: {
                    menu: {
                        name: 'Wine Regions'
                    }
                }
            }
        }, {
            name: 'locationDetail',
            state: {
                url: '/locations/:locationKey',
                templateUrl: TEMPLATE_PATH + 'locationdetail.html',
                controller: 'wtLocationDetails',
                controllerAs: "vm",
                resolve: {
                    locations: 'wtLocationsResolver'
                }
            }
        }],
        locations = null;

    angular.module('wt.locations', ['ngMaterial', 'wt.routes', 'wt.config', 'wt.fileloader'])
        .constant('wtLocationsConfig', {
            routes: ROUTES,
            dataPath: DATA_PATH
        })
        .config(moduleConfig)
        .factory('wtLocationsResolver', wtLocationsResolver)
        .controller('wtLocations', LocationController)
        .controller('wtLocationDetails', LocationDetailController);

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
        if (locations === null) {
            return wtJsonLoader(wtLocationsConfig.dataPath)
                .then(function(data) {
                    locations = createLocations(data);
                    return locations;
                });
        }
        return locations;
    }


    /**
     * Location controller
     */
    LocationController.$inject = ['locations'];

    function LocationController(locations) {
        var vm = this;

        // controller activation
        (function() {
            vm.locations = rootLocations(locations);

        })();
    }
    /**
     * Location detail controller
     */
    LocationDetailController.$inject = ['$stateParams', 'locations'];

    function LocationDetailController($stateParams, locations) {
        var vm = this,
            locationKey = $stateParams.locationKey;

        // controller activation
        (function() {
            vm.locations = locations;
            vm.current = locations[locationKey];
            vm.parent = vm.current.parentKey ? vm.locations[vm.current.parentKey] : null;
            vm.children = children(vm.locations, vm.current.key);
        })();
    }

    function children(locations,key){
        if(!angular.isObject(locations)) return null;

        var results = [];
        angular.forEach(locations,function(item){
            if(item.key.startsWith(key) &&
                item.key !== key &&
                (item.key.match(/-/g) || []).length === (key.match(/-/g) || []).length +1){
                results.push(item);
            }
        });
        return results.length>0 ? results : null;
    }


    function rootLocations(locations){
        if(!angular.isObject(locations)) return null;

        var results = [];
        angular.forEach(locations,function(item){
            if((item.key.match(/-/g) || []).length === 0){
                results.push(item);
            }
        });
        return results.length>0 ? results : null;
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
            var result = {};
            data.forEach(function(item) {
                var itemModel = new Location(item);
                result[itemModel.key] = itemModel;
            });
            return result;
        }

        return createLocationsHash;
    })();

})();