(function () {
    'use strict';

    angular.module('wt.variety.controller', [
            'ui.router',
            'ngMaterial'
        ])
        .controller('wtVariety', VarietyController);


    /**
     * variety controller
     */
    VarietyController.$inject = [];
    function VarietyController() {
        var vm = this;

        // controller activation
        (function () {
            vm.countries = [
                "Argentina",
                "Australia",
                "Austria",
                "Chile",
                "France",
                "Germany",
                "Italy",
                "New Zealand",
                "Portugal",
                "Spain",
                "South Africa",
                "USA"
            ];
            vm.variety = 'Premium Chardonnay';

            vm.selected = [];
      vm.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);
      };
      vm.exists = function (item, list) {
        return list.indexOf(item) > -1;
      };
        })();
    }

})();