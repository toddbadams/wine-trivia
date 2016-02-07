(function () {
    'use strict';
    var
    BASE_PATH = window.location.hostname === 'localhost' ? '' : '/wine-trivia',
    TEMPLATE_URL = BASE_PATH + '/app/settings/';

    angular.module('wt.settings', [
    ])
        .value('wt.settings', {
            certificaiton: 'wset3',
            numberExamQuestions: 4
        })
        .config(moduleConfig)
        .run(moduleRun)
        .controller('wtSettings', SettingsController);


    /**
     * Module configuration
     */
    moduleConfig.$inject = ['$stateProvider', 'localStorageServiceProvider', 'wt.variety.config'];
    function moduleConfig($stateProvider, localStorageServiceProvider, config) {
        localStorageServiceProvider.setPrefix('wt');
        config.routes.forEach(function (route) {
            $stateProvider.state('settings', {
                url: '/settings',
                templateUrl: TEMPLATE_URL + 'settings.html',
                controller: 'wtSettings',
                controllerAs: "vm"
            });
        });
    }

    moduleRun.$inject = ['localStorageService', 'wt.settings'];
    function moduleRun(localStorageService, settings) {
        if (!localStorageService.isSupported) return;

        settings = angular.extend(settings, localStorageService.get('settings'));
        localStorageService.set('settings', settings);
    }

    /**
     * Settings controller
     */
    SettingsController.$inject = ['wt.settings'];
    function SettingsController(settings) {
        var vm = this;

        // controller activation
        (function () {
            vm.settings = settings;
        })();
    }

})();