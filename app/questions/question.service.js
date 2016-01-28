(function (angular) {

    BASE_PATH = window.location.hostname === 'localhost' ? '' : '/wine-trivia',
    JSON_BASE_URL = '/app/questions/',
    NO_QUESTION_SELECTIONS = 4;

    angular.module('wt.questions.service', [])
        .factory('questionService', questionService);

    questionService.$inject = ['$http', 'wt.questions.config'];
    function questionService($http, config) {
        var cache = [],
            publicApi = {
                getQuestions: getQuestions
            };

        function getQuestions(name, qnty) {
            return getQuestionsFromJsonFile(name)
                .then(function (data) {
                    var q = (qnty) ? data.slice(0, qnty) : data;
                    return createQuestions(shuffle(q), config.numberQuestionSelections);
                });
        }

        function getQuestionsFromJsonFile(name) {
            return $http.get(buildFilename(name))
                .then(function (result) {
                    return result.data;
                });
        }

        function buildFilename(name) {
            return config.dataUrl + name + '.json';
        }   

        return publicApi;
    }


    // PRIVATE METHODS
    var Question = function (data, numberQuestionSelections) {
            this.stem = data.stem;
            this.selections = createSelections(data, numberQuestionSelections);
            this.selected = -1;
            },

            QuestionSelection = function (alternate, isAnswer) {
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
        var currentIndex = array.length, temporaryValue, randomIndex;

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
})(angular);