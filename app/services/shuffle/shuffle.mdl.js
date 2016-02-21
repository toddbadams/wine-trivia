(function() {
    'use strict'

    angular.module('wt.shuffle', [])
        .factory('wtShuffle', wtShuffle);

    wtShuffle.$inject = []

    function wtShuffle() {

        function shuffle(array, maxLength) {
            var currentIndex = array.length,
                temporaryValue, randomIndex,
                result = angular.copy(array);

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = result[currentIndex];
                result[currentIndex] = result[randomIndex];
                result[randomIndex] = temporaryValue;
            }

            if (angular.isNumber(maxLength)) {
                result = result.slice(0, maxLength);
            }
            return result;
        }

        return shuffle;
    }

})();
