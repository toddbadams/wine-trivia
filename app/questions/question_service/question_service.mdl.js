(function (angular) {

    BASE_PATH = window.location.hostname === 'localhost' ? '' : '/wine-trivia',
    JSON_BASE_URL = '/app/questions/question_service/';

    angular.module('wt.questions.service', [])
        .factory('questionService', questionService);

    questionService.$inject = ['$http'];
    function questionService($http) {
        var cache = [],
            publicApi = {
                getQuestions: getQuestions
            };

        function getQuestions(name, qnty) {
            return getQuestionsFromJsonFile(name)
                .then(function (data) {
                    var q = (qnty) ? data.slice(0, qnty) : data;
                    return createQuestions(shuffle(q));
                });
        }

        function getQuestionsFromJsonFile(name) {
            return $http.get(buildFilename(name))
                .then(function (result) {
                    return result.data;
                });
        }

        function buildFilename(name) {
            return BASE_PATH + JSON_BASE_URL + name + '.json';
        }

        return publicApi;
    }


    var Question = (function () {
        var q = function (data) {
            this.stem = data.stem;
            this.selections = createSelections(data, 4);
            this.selected = -1;
        },
            QuestionSelection = function (text, isAnswer) {
                this.text = text;
                this.isAnswer = isAnswer;
            };


        function createSelections(d, length) {
            var alts = shuffle(d.alternatives),
                answerIndex = Math.floor(Math.random() * length),
                i,
                j = 0,
                selections = [],
                correct = angular.isArray(d.correct) ? shuffle(d.correct)[0] : d.correct;

            for (i = 0; i < length; i += 1) {
                if (i === answerIndex) {
                    selections.push(new QuestionSelection(correct, true));
                } else {
                    selections.push(new QuestionSelection(alts[j++], false));
                }
            }
            return selections;
        }


        return q;
    })();





    // PRIVATE METHODS
    function createQuestions(data) {
        if (!data || !angular.isArray(data) || data.length === 0) return;
        var arr = [];
        data.forEach(function(q) {
            arr.push(new Question(q));
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

})(angular);