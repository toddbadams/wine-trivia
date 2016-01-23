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
            return ' <p>{{vm.current.stem}}</p>' +
                '<md-radio-group ng-model="vm.current.selected">' +
                '<md-radio-button ng-repeat="selection in vm.current.selections" value="{{$index}}" ' +
                '   class="md-primary">{{selection.text}}</md-radio-button>' +
                '</md-radio-group>';
        }
    }
})(angular);