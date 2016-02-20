(function() {
    'use strict';
    var
        TEMPLATE_PATH = 'app/features/locations/',
        ROUTES = [{
            name: 'locations',
            state: {
                url: '/locations',
                templateUrl: TEMPLATE_PATH + 'countries.html',
                controller: 'wtCountries',
                controllerAs: "vm",
                resolve: {
                    countries: 'wtCountriesResolver'
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
                    locations: 'wtLocationsHashResolver'
                }
            }
        }];

    angular.module('wt.locations', ['ngMaterial', 'wt.routes', 'wt.config',
            'wt.locations.data'
        ])
        .constant('wtLocationsConfig', {
            routes: ROUTES
        })
        .config(moduleConfig)
        .controller('wtCountries', wtCountriesController)
        .controller('wtLocationDetails', LocationDetailController);

    /**
     * Module configuration
     */
    moduleConfig.$inject = ['wtRouteProvider', 'wtLocationsConfig'];

    function moduleConfig(wtRoutes, moduleConfig) {
        wtRoutes.$get().setRoutes(moduleConfig.routes);
    }

    /**
     * Location controller
     */
    wtCountriesController.$inject = ['countries'];

    function wtCountriesController(countries) {
        var vm = this;

        // controller activation
        (function() {
            vm.countries = countries; 
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

    function children(locations, key) {
        if (!angular.isObject(locations)) return null;

        var results = [];
        angular.forEach(locations, function(item) {
            if (item.key.startsWith(key) &&
                item.key !== key &&
                (item.key.match(/-/g) || []).length === (key.match(/-/g) || []).length + 1) {
                results.push(item);
            }
        });
        return results.length > 0 ? results : null;
    }
})();
