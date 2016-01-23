(function () {
    'use strict';
    var TEMPLATE_BASE_URL = '/wine-trivia/app/questions/controller/';

    angular.module('wt.questions.controller', [
            'ui.router',
            'wt.questions.service'
    ])
        .constant('wt.questions.controller.config', {
            route: {
                name: 'questions',
                state: {
                    url: '/questions',
                    templateUrl: TEMPLATE_BASE_URL + 'questions.html',
                    controller: 'wtQuestions',
                    controllerAs: "vm" ,
                    resolve:
                    {
                        data: 'wt.questions.service.resolver'
                    }
                }
            }
        })
        .config(moduleConfig)
        .factory('wt.questions.service.resolver', QuestionControllerResolver)
        .controller('wtQuestions', QuestionController);

    /**
     * Module configuration
     */
    moduleConfig.$inject = ['$stateProvider', '$urlRouterProvider', 'wt.questions.controller.config'];
    function moduleConfig($stateProvider, $urlRouterProvider, config) {
        // For any unmatched url, send to /route1
        $urlRouterProvider.otherwise("/route1");
        $stateProvider.state(config.route.name, config.route.state);
    }


    /**
     * Question controller data resolver
     */
    QuestionControllerResolver.$inject = ['questionService'];
    function QuestionControllerResolver(questionService) {
        var f =  questionService.getQuestions();
        return f;
    }


    /**
     * Question controller
     */
    QuestionController.$inject = ['data'];
    function QuestionController(data) {
        var vm = this;

        function dataErrorCheck(data){
            // todo
            return data;
        }
        // controller activation
        (function () {
            vm.data = dataErrorCheck(data);
            vm.current = vm.data[0];
            window.foo = vm;
        })();
    }

})();