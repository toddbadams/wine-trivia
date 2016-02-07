(function() {
	'use strict';
	var
		BASE_PATH = window.location.hostname === 'localhost' ? '' : '/wine-trivia',
		TEMPLATE_URL = BASE_PATH + '/app/questions/',
		ROUTES = [{
				name: 'questions',
				state: {
					url: '/questions',
					templateUrl: TEMPLATE_URL + 'questions.html',
					controller: 'wtQuestions',
					controllerAs: "vm",
					resolve: {
						data: 'wt.questions.controller.resolver'
					}
				}
			}, {
				name: 'editor',
				state: {
					url: '/editor',
					templateUrl: TEMPLATE_URL + 'editor/editor.html',
					controller: 'wtQuestionsEditor',
					controllerAs: "vm"
				}
			}];

	angular.module('wt.questions', [
			'ui.router',
            'ngMaterial'
		])
		.constant('wt.questions.config', {
			routes: ROUTES,
			dataUrl: BASE_PATH + '/app/questions/',
			questionsFileName: 'wset3',
			numberQuestions: 4,
			numberQuestionSelections: 4
		})
		.config(moduleConfig)
		.factory('questionService', questionService)
        .factory('wt.questions.controller.resolver', QuestionControllerResolver)
        .controller('wtQuestions', QuestionController);


	/**
	 * Module configuration
	 */
	moduleConfig.$inject = ['$stateProvider', 'wt.questions.config'];

	function moduleConfig($stateProvider, config) {
		config.routes.forEach(function(route) {
			$stateProvider.state(route.name, route.state);
		});
	}


	/**
	 * Questions Data Service
	 */
	questionService.$inject = ['$http', 'wt.questions.config'];

	function questionService($http, config) {
		var cache = [],
			publicApi = {
				getQuestions: getQuestions
			};

		function getQuestions(name, qnty) {
			return getQuestionsFromJsonFile(name)
				.then(function(data) {
					var q = (qnty) ? data.slice(0, qnty) : data;
					return createQuestions(shuffle(q), config.numberQuestionSelections);
				});
		}

		function getQuestionsFromJsonFile(name) {
			return $http.get(buildFilename(name))
				.then(function(result) {
					return result.data;
				});
		}

		function buildFilename(name) {
			return config.dataUrl + name + '.json';
		}

		return publicApi;
	}


	// PRIVATE METHODS
	var Question = function(data, numberQuestionSelections) {
			this.stem = data.stem;
			this.selections = createSelections(data, numberQuestionSelections);
			this.selected = -1;
		},

		QuestionSelection = function(alternate, isAnswer) {
			this.text = alternate.text;
			this.description = alternate.description;
			this.isAnswer = isAnswer;
			this.id = alternate.id;
		};

	function createQuestions(data, numberQuestionSelections) {
		if (!data || !angular.isArray(data) || data.length === 0) return;
		var arr = [];
		data.forEach(function(q) {
			arr.push(new Question(q, numberQuestionSelections));
		});
		return arr;
	}

	function shuffle(array) {
		var currentIndex = array.length,
			temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	function createSelections(d, length) {
		var alts = shuffle(d.alternates),
			answerIndex = Math.floor(Math.random() * length),
			i,
			j = 0,
			selections = [],
			correct = angular.isArray(d.correct) ? shuffle(d.correct)[0] : d.correct;

		for (i = 0; i < length; i += 1) {
			if (i === answerIndex) {
				selections.push(new QuestionSelection({
					text: correct.text,
					description: correct.description,
					id: correct.id
				}, true));
			} else {
				selections.push(new QuestionSelection(alts[j++], false));
			}
		}
		return selections;
	}

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
            vm.level = {
                filename: 'wset3',
                name: 'WSET 3'
            }
            vm.tags = 'France'
            window.foo = vm;
        })();
    }

})();