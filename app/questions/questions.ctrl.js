(function () {
    'use strict';

    angular.module('wt.questions.controller', [
            'ui.router',
            'wt.questions.service',
            'ngMaterial'
        ])
        .factory('wt.questions.controller.resolver', QuestionControllerResolver)
        .controller('wtQuestions', QuestionController);


    /**
     * Question controller data resolver
     */
    QuestionControllerResolver.$inject = ['questionService', 'wt.questions.config'];
    function QuestionControllerResolver(questionService, config) {
        return questionService.getQuestions(config.questionsFileName, config.numberQuestions);
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

        function selected(selectedIndex){
            vm.current.selections[selectedIndex].isWrong = !vm.current.selections[selectedIndex].isAnswer;
            vm.current.description = vm.current.selections[selectedIndex].description;
        }

        function previous(){
            if(vm.index > 0) {
                vm.index -= 1;
                showPrevNextButtons(); 
            }         
        }

        function next(){
            if(vm.index < vm.data.length - 1) {
                vm.index += 1;
                showPrevNextButtons();
            }          
        }

        function showPrevNextButtons(){
            vm.current = vm.data[vm.index]; 
            vm.showPrevious = vm.index > 0; 
            vm.showNext = vm.index < vm.data.length - 1; 
        }

        function isWrong(index){
            var w = vm.current.selected === index &&
                !vm.current.selections[index].isAnswer;
                return w;
        }

        // controller activation
        (function () {
            vm.data = dataErrorCheck(data);
            vm.index = 0;
            vm.current = vm.data[vm.index];
            vm.showResults = false;
            vm.showPrevious = false;
            vm.previous = previous;
            vm.showNext = true;
            vm.next = next;
            vm.selected = selected;
            vm.isWrong = isWrong;
            vm.tags = ['France','Bordeaux'];
            vm.tagsReadonly = true;
            window.foo = vm;
        })();
    }

})();