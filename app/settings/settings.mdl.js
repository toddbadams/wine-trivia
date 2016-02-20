(function() {
    'use strict';
    var
        TEMPLATE_PATH = 'app/settings/',
        DATA_PATH = 'app/settings/',
        ROUTES = [{
            name: 'settings',
            state: {
                url: '/settings',
                templateUrl: TEMPLATE_PATH + 'settings.html',
                controller: 'wtSettings',
                controllerAs: "vm"
            }
        }],
        tags = null,
        questionsData = null;

    angular.module('wt.settings', ['ngMaterial', 'wt.routes', 'wt.config', 'wt.fileloader'])
        .constant('wtSettingsConfig', {
            routes: ROUTES,
            dataPath: DATA_PATH
        })
        .value('wt.settings', {
            level: 'wset3',
            numberExamQuestions: 4
        })
        .config(moduleConfig)
        .run(moduleRun)
        .controller('wtSettings', SettingsController);

    /**
     * Module configuration
     */
    moduleConfig.$inject = ['wtRouteProvider', 'wtSettingsConfig'];

    function moduleConfig(wtRoutes, moduleConfig) {
        wtRoutes.$get().setRoutes(moduleConfig.routes);
        //        localStorageServiceProvider.setPrefix('wt');
    }

    moduleRun.$inject = []; //'localStorageService', 'wt.settings'];

    function moduleRun(localStorageService, settings) {
     //   if (!localStorageService.isSupported) return;

//        settings = angular.extend(settings, localStorageService.get('settings'));
  //      localStorageService.set('settings', settings);
    }

    /**
     * Settings controller
     */
    SettingsController.$inject = [];

    function SettingsController() {
        var vm = this;

        // controller activation
        (function() {
            vm.settings = {};
        })();
    }

})();