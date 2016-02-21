(function() {
    'use strict'

    angular.module('wt.resolver', [])
        .factory('wtResolver', wtResolver);

    wtResolver.$inject = ['$q']

    function wtResolver($q) {
        function resolver(promise, cache, createFn) {
            var deferred = $q.defer();
            if (cache === null) {
                promise
                    .then(function(data) {
                        cache = createFn ? createFn(data) : data;
                        deferred.resolve(cache);
                    });
            } else {
                deferred.resolve(cache);
            }
            return deferred.promise;
        }
        return resolver;
    }

})();
