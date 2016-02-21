(function() {
    'use strict';
    var
        TEMPLATE_PATH = 'app/features/questions/',
        ROUTES = [{
            name: 'questions',
            state: {
                url: '/questions/:tag',
                templateUrl: TEMPLATE_PATH + 'questions.html',
                controller: 'wtQuestions',
                controllerAs: "vm",
                resolve: {
                    questions: 'wtQuestionModelsResolver'
                }
            }
        }];

    angular.module('wt.questions', ['ngMaterial', 'wt.routes', 'wt.questions.data', 'wt.questions.filters'])
        .constant('wtQuestionsConfig', {
            routes: ROUTES
        })
        .config(moduleConfig)
        .controller('wtQuestions', wtQuestions)
        .controller('wtQuestion', wtQuestion)
        .component('wtQuestion', {
            bindings: {
                model: '='
            },
            controller: 'wtQuestion as vm',
            templateUrl: TEMPLATE_PATH + 'question.html'
        });


    /**
     * Module configuration
     */
    moduleConfig.$inject = ['wtRouteProvider', 'wtQuestionsConfig'];

    function moduleConfig(wtRoutes, wtQuestionsConfig) {
        wtRoutes.$get().setRoutes(wtQuestionsConfig.routes);
    }

    /**
     * Question controller
     */
    wtQuestions.$inject = ['$stateParams', 'wtQuestionsByTagFilter', 'questions'];

    function wtQuestions($stateParams, wtQuestionsByTagFilter, questions) {
        var vm = this,
            tag = $stateParams.tag;

        function selected(selectedIndex) {
            vm.current.selections[selectedIndex].isWrong = !vm.current.selections[selectedIndex].isAnswer;
            vm.current.description = vm.current.selections[selectedIndex].description;
        }

        function previous() {
            if (vm.index > 0) {
                vm.index -= 1;
                showPrevNextButtons();
            }
        }

        function next() {
            if (vm.index < vm.questions.length - 1) {
                vm.index += 1;
                showPrevNextButtons();
            }
        }

        function showPrevNextButtons() {
            vm.current = vm.questions[vm.index];
            vm.showPrevious = vm.index > 0;
            vm.showNext = vm.index < vm.questions.length - 1;
        }

        function isWrong(index) {
            var w = vm.current.selected === index &&
                !vm.current.selections[index].isAnswer;
            return w;
        }

        // controller activation
        (function() {
            vm.questions = wtQuestionsByTagFilter(questions, tag);
            vm.index = 0;
            vm.current = vm.questions[vm.index];
            vm.showResults = false;
            vm.showPrevious = false;
            vm.previous = previous;
            vm.showNext = true;
            vm.next = next;
            vm.selected = selected;
            vm.isWrong = isWrong;
        })();
    }



    /**
     * Question controller
     */
    wtQuestion.$inject = [];

    function wtQuestion() {
        var vm = this;


        function selected(selectedIndex) {
            if (!vm.model) return;
            vm.model.selected = selectedIndex;
            vm.model.selections[selectedIndex].isWrong = !vm.model.selections[selectedIndex].isAnswer;
            vm.model.description = vm.model.selections[selectedIndex].description;
        }

        // controller activation
        (function() {
            vm.selected = selected;
        })();
    }
})();
