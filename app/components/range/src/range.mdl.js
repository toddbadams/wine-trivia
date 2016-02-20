(function() {
	'use strict'

	angular.module('wt.range', ['ngMaterial'])
		.controller('wtRangeController', wtRangeController)
	.directive('wtRange', wtRange);


	function wtRange() {
		return {
			restrict: "E",
			bindToController: {
				values: '=',
				ngModel: '='
			},
			scope: true,
			template: '<div layout="row" class="range">' +
				'<md-radio-button ng-repeat="item in vm.values" value="{{item}}" aria-label="{{item}}"></md-radio-button>' +
				'</div>',
			controller: wtRangeController,
			controllerAs: 'vm'
		}
	}


	function wtRangeController() {
		var vm = this;
		

		// controller activation
		(function(){
			
		})();
	}
})();