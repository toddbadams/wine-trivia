(function (angular) {

    angular.module('wt.questions.service', [])
        .factory('questionService', questionService);

    questionService.$inject = ['$http'];
    function questionService($http) {
        var cache = [],
            publicApi = {
                getQuestions: getQuestions
            };

        function getQuestions(name) {
            var questions = getQuestionsFromJsonFile('wset3')
                .then(function (data) {
                    return createQuestions(data);
                });
        }

        function getQuestionsFromJsonFile(name) {
            return $http.get(buildFilename(name))
                .then(function (result) {
                    return result.data;
                });
        }

        function buildFilename(name) {
            return '/app/questions/question_service/' + name + '.json';
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
                selections = [];

            for (i = 0; i < length; i += 1) {
                if (i === answerIndex) {
                    selections.push(new QuestionSelection(d.correct, true));
                } else {
                    selections.push(new QuestionSelection(alts[j++], false));
                }
            }
            return selections;
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



})(angular);