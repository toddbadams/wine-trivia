(function() {
    'use strict';
    var
        DATA_PATH = 'app/features/locations/',
        locations = null;

    angular.module('wt.locations.data', ['wt.config', 'wt.fileloader'])
        .constant('wtLocationsDataConfig', {
            dataPath: DATA_PATH
        })
        .factory('wtLocationsHashResolver', wtLocationsHashResolver)
        .factory('wtCountriesResolver', wtCountriesResolver);

    /**
     * Location controller data resolver
     */
    wtLocationsHashResolver.$inject = ['$q', 'wtLocationsDataConfig', 'wtJsonLoader'];

    function wtLocationsHashResolver($q, wtLocationsDataConfig, wtJsonLoader) {
        var deferred = $q.defer();
        if (locations === null) {
            wtJsonLoader(wtLocationsDataConfig.dataPath)
                .then(function(data) {
                    locations = new Locations(data);
                    deferred.resolve(locations.hash);
                });
        }
        return deferred.promise;
    }

    /**
     * An array of country locations
     */
    wtCountriesResolver.$inject = ['$q', 'wtLocationsHashResolver'];

    function wtCountriesResolver($q, wtLocationsHashResolver) {
        var deferred = $q.defer();
        if (locations === null) {
            wtLocationsHashResolver
                .then(function() {
                    deferred.resolve(locations.countries);
                });
        } else {
            deferred.resolve(locations.countries);
        }
        return deferred.promise;
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

    function rootLocations(locations) {
        if (!angular.isObject(locations)) return null;

        var results = [];
        angular.forEach(locations, function(item) {
            if ((item.key.match(/-/g) || []).length === 0) {
                results.push(item);
            }
        });
        return results.length > 0 ? results : null;
    }

    var Locations = (function() {

        var Location = function(data) {
                this.key = data.key;
                this.parentKey = parentKey(this.key);
                this.childKey = childKey(this.key);
                this.value = data.value; // The location name
                this.description = data.description || null;
                this.soil = data.soil || null;
                this.notes = data.notes || null;
                this.varieties = data.varieties || null;
                this.late = data.late || null;
                if (angular.isNumber(data.lat) &&
                    angular.isNumber(data.long) &&
                    angular.isNumber(data.zoom)) {
                    this.lat = data.lat;
                    this.lon = data.lon;
                    this.zoom = data.zoom;
                }
            },
            Locations = function(data) {
                this.array = data;
                this.hash = createLocationsHash(data);
                this.countries = rootLocations(data);
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



        return Locations;
    })();

    function asPromise($q, data) {
        var deferred = $q.defer();
        $q.resolve(data);
        return deferred.promise;
    }

})();
