(function() {
	'use strict';
	var
		TEMPLATE_PATH = 'app/features/questions/',
		ROUTES = [{
			name: 'knowledgeTags',
			state: {
				url: '/knowledge',
				templateUrl: TEMPLATE_PATH + 'knowledgeareas.html',
				controller: 'wtKnowledgeAreas',
				controllerAs: "vm",
				resolve: {
					areas: 'wtQuestionTagsResolver'
				},
				data: {
					menu: {
						name: 'Study Questions'
					}
				}
			}
		}];

	angular.module('wt.knowledgeAreas', ['ngMaterial', 'wt.routes', 'wt.config'])
		.constant('wtKnowledgeAreasConfig', {
			routes: ROUTES
		})
		.config(moduleConfig)
		.controller('wtKnowledgeAreas', wtKnowledgeAreas);


	/**
	 * Module configuration
	 */
	moduleConfig.$inject = ['wtRouteProvider', 'wtKnowledgeAreasConfig'];

	function moduleConfig(wtRoutes, wtKnowledgeAreasConfig) {
		wtRoutes.$get().setRoutes(wtKnowledgeAreasConfig.routes);
	}


	/**
	 * Knowledge Area controller
	 */
	wtKnowledgeAreas.$inject = ['areas'];

	function wtKnowledgeAreas(areas) {
		var vm = this;

		// controller activation
		(function() {
			vm.areas = areas;
		})();
	}
})();