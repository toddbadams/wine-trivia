(function () {
    'use strict';
    var 
    BASE_PATH = window.location.hostname === 'localhost' ? '' : '/wine-trivia',
    TEMPLATE_URL = BASE_PATH + '/app/questions/';

	angular.module('wt.questions', [
	        'wt.questions.controller',
            'wt.questions.editor.controller'
	])
	.constant('wt.questions.config', {
	            routes: [{
	                name: 'questions',
	                state: {
	                    url: '/questions',
	                    templateUrl: TEMPLATE_URL + 'questions.html',
	                    controller: 'wtQuestions',
	                    controllerAs: "vm" ,
	                    resolve:
	                    {
	                        data: 'wt.questions.controller.resolver'
	                    }
	                }
	            },
	            {
	                name: 'editor',
	                state: {
	                    url: '/editor',
	                    templateUrl: TEMPLATE_URL + 'editor/editor.html',
	                    controller: 'wtQuestionsEditor',
	                    controllerAs: "vm",
	                    resolve:
	                    {
	                        data: 'wt.questioneditor.controller.resolver'
	                    }
	                }
	            }],
	            dataUrl: BASE_PATH + '/app/questions/',
	 			questionsFileName: 'wset3',
	    		numberQuestions: 4,
	    		numberQuestionSelections: 4
	        })
	        .config(moduleConfig);


    /**
     * Module configuration
     */
    moduleConfig.$inject = ['$stateProvider',  'wt.questions.config'];
    function moduleConfig($stateProvider, config) {
        config.routes.forEach(function (route) {
            $stateProvider.state(route.name, route.state);
        });
    }

})();