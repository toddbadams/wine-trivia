(function () {
    'use strict';
    var 
    BASE_PATH = window.location.hostname === 'localhost' ? '' : '/wine-trivia',
    TEMPLATE_BASE_URL = '/app/questions/controller/';

    angular.module('wt.questions.controller', [
            'ui.router',
            'wt.questions.service'
    ])
        .constant('wt.questions.controller.config', {
            route: {
                name: 'questions',
                state: {
                    url: '/questions',
                    templateUrl: BASE_PATH + TEMPLATE_BASE_URL + 'questions.html',
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
    moduleConfig.$inject = ['$stateProvider',  'wt.questions.controller.config'];
    function moduleConfig($stateProvider,  config) {

        $stateProvider.state(config.route.name, config.route.state);
    }


    /**
     * Question controller data resolver
     */
    QuestionControllerResolver.$inject = ['questionService'];
    function QuestionControllerResolver(questionService) {
        return questionService.getQuestions('wset3',10);
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

        function next(){
            vm.index = vm.index===data.length-1 ? 0 : vm.index +1;
            vm.current = vm.data[vm.index];
        }
        
        function previous(){
            vm.index = vm.index===0 ? data.length-1 : vm.index -1;
            vm.current = vm.data[vm.index];
        }

        // controller activation
        (function () {
            vm.data = dataErrorCheck(data);
            vm.index = 0;
            vm.current = vm.data[vm.index];
            vm.next = next;
            vm.previous = previous;
            window.foo = vm;
        })();
    }

})();