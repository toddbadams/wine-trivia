(function() {
    'use strict';

    angular.module('wt.questions.filters', [])
        .filter('wtQuestionsByTag', wtQuestionsByTag);

    wtQuestionsByTag.$inject = [];

    function wtQuestionsByTag() {
        function filterByTag(questions, tag) {
            if (!angular.isArray(questions) || questions.length === 0) return [];
            if (tag === 'all') return questions;

            var results = [];
            questions.forEach(function(question) {
                if (angular.isArray(question.tags) &&
                    inArray(question.tags, tag)) {
                    results.push(question);
                }
            })
            return results;
        }
        return filterByTag;
    }

    function inArray(arr, item) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === item) return true;
        }
        return false;
    }
})();
