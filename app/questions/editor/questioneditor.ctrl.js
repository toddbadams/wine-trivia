(function () {
    'use strict';

    angular.module('wt.questions.editor.controller', [
            'ui.router',
            'ngMaterial'
        ])
        .controller('wtQuestionsEditor', QuestionController);

    /**
     * Question controller
     */
    QuestionController.$inject = [];
    function QuestionController(data) {
        var vm = this;

        function addCorrect() {
            vm.data.correct.push(emptySelection());
        }
        function addAlternate() {
            vm.data.correct.push(emptySelection());
        }

        function emptyQuestion() {
            return {
                stem: null,
                alternates: [],
                correct: [],
                tags: []
            }
        }

        function emptySelection() {
            return {
                text: null,
                description: null
            }
        }
        // controller activation
        (function () {
            vm.data = emptyQuestion();
            vm.addCorrect = addCorrect;
            vm.addAlternate = addAlternate;
            window.foo = vm;
        })();
    }

})();