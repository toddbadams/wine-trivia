(function() {
	'use strict';
	var
		TEMPLATE_PATH = 'app/layouts/';

	angular.module('wt.layout', ['ngMaterial', 'wt.routes'])
		.controller('wtLayout', LayoutController);


	/**
	 * Layout controller
	 */
	LayoutController.$inject = ['wtRoutes'];

	function LayoutController(wtRoutes) {
		var vm = this;

		function openMenu($mdOpenMenu, ev) {
			vm.menuItems = wtRoutes.getMenuItems();
			$mdOpenMenu(ev);
		}

		// controller activation
		(function() {
			vm.openMenu = openMenu;
			vm.menuItems = [];
		})();
	}
})();