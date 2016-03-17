(function() {
    'use strict';

    var
        TEMPLATE_PATH = 'app/features/questions/',
        ROUTES = [{
            name: 'questionsEditor',
            state: {
                url: '/questions/:tag/edit',
                templateUrl: TEMPLATE_PATH + 'questionsEditor.html',
                controller: 'wtQuestionsEditor',
                controllerAs: "vm",
                resolve: {
                    questions: 'wtQuestionDataResolver'
                }
            }
        }];

    angular
        .module('wt.questionsEditor', ['ngMaterial', 'wt.routes', 'wt.questions.data',
            'wt.questions.viewModelFactory'
        ])
        .constant('wtQuestionsEditorConfig', {
            routes: ROUTES
        })
        .config(moduleConfig)
        .controller('wtQuestionsEditor', wtQuestionsEditor)
        .component('wtQuestionEditor', {
            bindings: {
                model: '='
            },
            controller: function($scope){
                window.foo2 = $scope;
            },
            templateUrl: TEMPLATE_PATH + 'questionEditor.html'
        })
        .component('wtQuestionSelectionEditor', {
            bindings: {
                model: '='
            },
            templateUrl: TEMPLATE_PATH + 'selectionEditor.html'
        });

    moduleConfig.$inject = ['wtRouteProvider', 'wtQuestionsEditorConfig'];

    function moduleConfig(wtRoutes, wtQuestionsEditorConfig) {
        wtRoutes.$get().setRoutes(wtQuestionsEditorConfig.routes);
    }

    wtQuestionsEditor.$inject = ['$stateParams', 'questions', 'wtQuestionsViewModelFactory'];

    function wtQuestionsEditor($stateParams, questions, modelFactory) {
        var vm = modelFactory(questions)
            .createQuestions($stateParams.tag);
            window.foo = vm;
        return vm;
    }


    /**
     * Question Editor controller
     */
    QuestionController.$inject = [];

    function QuestionController(data) {
        var vm = this;

        function addCorrect() {
            vm.data.correct.push(emptySelection(vm.currendSelectionId++));
        }

        function addAlternate() {
            vm.data.alternates.push(emptySelection(vm.currendSelectionId++));
        }

        function emptyQuestion() {
            return {
                id: 0,
                stem: null,
                alternates: [],
                correct: [],
                tags: []
            }
        }

        function emptySelection(index) {
            return {
                id: index,
                text: null,
                description: null
            }
        }

        function ngChange() {
            vm.text = JSON.stringify(new Question(vm.data));
        }

        var Selection = function(data) {
                this.id = data.id;
                this.text = data.text;
                this.description = data.description;
            },
            Question = function(data) {
                var self = this;
                this.correct = [];
                data.correct.forEach(function(item) {
                    self.correct.push(new Selection(item));
                });
                this.alternates = [];
                data.alternates.forEach(function(item) {
                    self.alternates.push(new Selection(item));
                });
                this.stem = data.stem;
                this.tags = [];
                data.tags.forEach(function(item) {
                    self.tags.push(item);
                });
            };

        /**
         * Return the proper object when the append is called.
         */
        function transformChip(chip) {
            // If it is an object, it's already a known chip
            if (angular.isObject(chip)) {
                return chip;
            }
            // Otherwise, create a new one
            return {
                name: chip,
                type: 'new'
            }
        }

        /**
         * Search for vegetables.
         */
        function querySearch(query) {
            var results = query ? vm.vegetables.filter(createFilterFor(query)) : [];
            return results;
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(vegetable) {
                return (vegetable.toLowerCase().indexOf(lowercaseQuery) === 0);
            };
        }

        function loadVegetables() {
            var veggies = ['Broccoli', 'Cabbage', 'carrot', 'Lettuce', 'Spinach'];
            return veggies;
        }

        // controller activation
        (function() {
            vm.currendSelectionId = 1;
            vm.data = emptyQuestion();
            vm.addCorrect = addCorrect;
            vm.addAlternate = addAlternate;
            vm.ngChange = ngChange;
            vm.transformChip = transformChip;
            vm.selectedTabs = [];
            vm.selectedItem = null;
            vm.searchText = null;
            vm.querySearch = querySearch;
            vm.vegetables = loadVegetables();
            window.foo = vm;
        })();
    }

})();