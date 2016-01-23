(function (angular) {

    angular.module('wt.questions.directives', [
        'ngMaterial'
    ])
        .directive('wtQuestion', questionDirective);

    questionDirective.$inject = [];
    function questionDirective() {
        return {
            restrict: 'E',
            template: buildTemplate()
        }

        function buildTemplate() {
            return ' <p>Selected Value: <span class="radioValue">{{ data.group1 }}</span> </p>' +
                '<md-radio-group ng-model="data.group1">' +
                '<md-radio-button value="Apple" class="md-primary">Apple</md-radio-button>' +
                '<md-radio-button value="Banana"> Banana </md-radio-button>' +
                '<md-radio-button value="Mango">Mango</md-radio-button>' +
                '</md-radio-group>';
        }
    }
})(angular);