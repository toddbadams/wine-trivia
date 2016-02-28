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
                    questions: 'wtQuestionDataResolver'
                }
            }
        }];

    angular.module('wt.questions', ['ngMaterial', 'wt.routes', 'wt.questions.data',
            'wt.questions.viewModelFactory'
        ])
        .constant('wtQuestionsConfig', {
            routes: ROUTES
        })
        .config(moduleConfig)
        .controller('wtQuestions', wtQuestions)
        .component('wtQuestion', {
            bindings: {
                model: '='
            },
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
     * Questions controller
     */
    wtQuestions.$inject = ['$stateParams', 'questions', 'wtQuestionsViewModelFactory'];

    function wtQuestions($stateParams, questions, modelFactory) {
        var vm = modelFactory(questions);
        vm.createQuestions($stateParams.tag)
        window.foo = vm;
        
        return vm;
    }

})();
