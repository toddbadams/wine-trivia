(function() {
    'use strict';
    var
        DATA_PATH = 'app/features/questions/',
        tags = null,
        questionModels = null,
        questionData = null,
        NUMBER_QUESTION_SELECTIONS = 4;

    angular.module('wt.questions.data', ['wt.config', 'wt.fileloader', 'wt.resolver'])
        .constant('wtQuestionsDataConfig', {
            dataPath: DATA_PATH
        })
        .factory('wtQuestionModelsResolver', wtQuestionModelsResolver)
        .factory('wtQuestionDataResolver', wtQuestionDataResolver)
        .factory('wtQuestionTagsResolver', wtQuestionTagsResolver);

    /**
     * Questions model resolver  
     */
    wtQuestionModelsResolver.$inject = ['wtResolver', 'wtQuestionDataResolver'];

    function wtQuestionModelsResolver(wtResolver, wtQuestionDataResolver) {
        return wtResolver(wtQuestionDataResolver, questionModels, createQuestions);
    }


    /**
     * Questions data resolver
     */
    wtQuestionDataResolver.$inject = ['wtResolver', 'wtJsonLoader', 'wtQuestionsDataConfig'];

    function wtQuestionDataResolver(wtResolver, wtJsonLoader, wtQuestionsDataConfig) {
        return wtResolver(wtJsonLoader(wtQuestionsDataConfig.dataPath), questionData);
    }


    /**
     * Question Tag controller data resolver
     */
    wtQuestionTagsResolver.$inject = ['wtResolver', 'wtQuestionDataResolver'];

    function wtQuestionTagsResolver(wtResolver, wtQuestionDataResolver) {
        return wtResolver(wtQuestionDataResolver, tags, createTags);
    }


    // PRIVATE METHODS
    var Question = function(data) {
            this.stem = data.stem;
            this.selections = createSelections(data, NUMBER_QUESTION_SELECTIONS);
            this.selected = -1;
            this.tags = data.tags;
            this.raw = angular.copy(data);
        },

        QuestionSelection = function(alternate, isAnswer) {
            this.text = alternate.text;
            this.description = alternate.description;
            this.isAnswer = isAnswer;
            this.id = alternate.id;
        };

    function createQuestions(data, numberQuestionSelections) {
        if (!angular.isArray(data) || data.length === 0) return [];
        var results = [],
            questions = data,
            i;

        for (i = 0; i < questions.length; i += 1) {
            results.push(new Question(questions[i], numberQuestionSelections));
        }
        return results;
    }

    function createQuestionsByTag(tag, data, numberQuestionSelections, numberQuestions) {
        if (!angular.isArray(data) || data.length === 0) return;
        var results = [],
            questions = filterByTag(data, tag),
            i;

        if (numberQuestions > questions.length) {
            numberQuestions = questions.length;
        }

        for (i = 0; i < numberQuestions; i += 1) {
            results.push(new Question(questions[i], numberQuestionSelections));
        }
        return results;
    }

    function filterByTag(data, tag) {
        if (!angular.isArray(data) || data.length === 0) return [];
        if (tag === 'all') return data;

        var results = [];
        data.forEach(function(question) {
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
