(function() {
	'use strict';
	var
		TEMPLATE_PATH = 'app/features/questions/',
		DATA_PATH = 'app/features/questions/',
		ROUTES = [{
			name: 'questionTags',
			state: {
				url: '/questions',
				templateUrl: TEMPLATE_PATH + 'tags.html',
				controller: 'wtQuestionTags',
				controllerAs: "vm",
				resolve: {
					data: 'wtQuestionTagsResolver'
				},
				data: {
					menu: {
						name: 'Study Questions'
					}
				}
			}
		}, {
			name: 'questions',
			state: {
				url: '/questions/:tag',
				templateUrl: TEMPLATE_PATH + 'questions.html',
				controller: 'wtQuestions',
				controllerAs: "vm",
				resolve: {
					tags: 'wtQuestionTagsResolver'
				}
			}
		}],
		tags = null,
		questionsData = null;

	angular.module('wt.questions', ['ngMaterial', 'wt.routes', 'wt.config', 'wt.fileloader'])
		.constant('wtQuestionsConfig', {
			routes: ROUTES,
			dataPath: DATA_PATH,
			numberQuestionSelections: 4
		})
		.config(moduleConfig)
		.factory('wtQuestionTagsResolver', wtQuestionTagsResolver)
		.controller('wtQuestions', QuestionController)
		.controller('wtQuestionTags', QuestionTagController);


	/**
	 * Module configuration
	 */
	moduleConfig.$inject = ['wtRouteProvider', 'wtQuestionsConfig'];

	function moduleConfig(wtRoutes, moduleConfig) {
		wtRoutes.$get().setRoutes(moduleConfig.routes);
	}


	/**
	 * Question Tag controller data resolver
	 */
	wtQuestionTagsResolver.$inject = ['wtJsonLoader', 'wtQuestionsConfig'];

	function wtQuestionTagsResolver(wtJsonLoader, moduleConfig) {
		if (tags !== null) {
			return tags;
		}
		return wtJsonLoader(moduleConfig.dataPath)
			.then(function(data) {
				if (!angular.isArray(data)) {
					throw new Error();
				}
				questionsData = data;
				tags = createTags(questionsData);
				return tags;
			});
	}



	/**
	 * Question Tag controller
	 *  A tag is a knowledge area, show a list of them
	 */
	QuestionTagController.$inject = ['data'];

	function QuestionTagController(data) {
		var vm = this;

		// controller activation
		(function() {
			vm.tags = data;
		})();
	}


	/**
	 * Question controller
	 */
	QuestionController.$inject = ['$stateParams', 'tags'];

	function QuestionController($stateParams, tags) {
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
			vm.questions = createQuestions(tag, questionsData, 4, 10);
			vm.index = 0;
			vm.current = vm.questions[vm.index];
			vm.showResults = false;
			vm.showPrevious = false;
			vm.previous = previous;
			vm.showNext = true;
			vm.next = next;
			vm.selected = selected;
			vm.isWrong = isWrong;
			vm.level = {
				filename: 'wset3',
				name: 'WSET 3'
			}
			window.foo = vm;
		})();
	}


	// PRIVATE METHODS
	var Question = function(data, numberQuestionSelections) {
			this.stem = data.stem;
			this.selections = createSelections(data, numberQuestionSelections);
			this.selected = -1;
			this.tags = data.tags;
		},

		QuestionSelection = function(alternate, isAnswer) {
			this.text = alternate.text;
			this.description = alternate.description;
			this.isAnswer = isAnswer;
			this.id = alternate.id;
		};

	function createQuestions(tag, data, numberQuestionSelections, numberQuestions) {
		if (!angular.isArray(data) || data.length === 0) return;
		var results = [],
			questions = shuffle(filterByTag(data,tag)),
			i;

		if (numberQuestions > questions.length) {
			numberQuestions = questions.length;
		}

		for (i = 0; i < numberQuestions; i += 1) {
			results.push(new Question(questions[i], numberQuestionSelections));
		}
		return results;
	}

	function filterByTag(data, tag){
		if (!angular.isArray(data) || data.length === 0) return [];
		if(tag === 'all') return data;

		var results = [];
		data.forEach(function(question){
			if (angular.isArray(question.tags) &&
				inArray(question.tags, tag)) {
					results.push(question);
				}
		})
		return results;
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

	function createTags(questions) {
		if (!angular.isArray(questions) || questions.length < 1) {
			return [];
		}
		var results = [];
		questions.forEach(function(question) {
			if (!angular.isArray(question.tags) || question.tags.length < 1) {
				return;
			}

			question.tags.forEach(function(tag) {
				if (!inArray(results, tag)) {
					results.push(tag);
				}
			});
		});

		return results;
	}

	function inArray(arr, item) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] === item) return true;
		}
		return false;
	}
})();