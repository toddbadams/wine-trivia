(function() {
	'use strict'

	angular.module('wt.inarray', [])
		.factory('wtInArray', wtInArray);

	wtInArray.$inject = []

	function wtInArray() {

		function wtInArray(arr, item) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] === item) return true;
			}
			return false;
		}

		return wtInArray;
	}

})();