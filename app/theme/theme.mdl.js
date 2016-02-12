(function() {
	'use strict'

	angular.module('wt.theme', ['ngMaterial'])
		.config(config);

	config.$inject = ['$mdThemingProvider'];

	function config($mdThemingProvider) {
		var customPrimary = {
				'50': '#bb0048',
				'100': '#a2003e',
				'200': '#880034',
				'300': '#6f002b',
				'400': '#550021',
				'500': '3C0017',
				'600': '#22000d',
				'700': '#090003',
				'800': '#000000',
				'900': '#000000',
				'A100': '#d50052',
				'A200': '#ee005b',
				'A400': '#ff0967',
				'A700': '#000000'
			},
			customAccent = {
				'50': '#fff6ee',
				'100': '#ffe9d5',
				'200': '#ffdbbb',
				'300': '#ffcea2',
				'400': '#ffc088',
				'500': '#FFB36F',
				'600': '#ffa655',
				'700': '#ff983c',
				'800': '#ff8b22',
				'900': '#ff7d09',
				'A100': '#ffffff',
				'A200': '#ffffff',
				'A400': '#ffffff',
				'A700': '#ee7100'
			},
			customWarn = {
				'50': '#e58c8e',
				'100': '#e07779',
				'200': '#db6265',
				'300': '#d64e50',
				'400': '#d2393c',
				'500': 'C42D30',
				'600': '#af282b',
				'700': '#9a2326',
				'800': '#861f21',
				'900': '#711a1c',
				'A100': '#e9a1a2',
				'A200': '#eeb5b7',
				'A400': '#f3cacb',
				'A700': '#5c1517'
			},
			customBackground = {
				'50': '#ffffff',
				'100': '#fffefb',
				'200': '#fff5e1',
				'300': '#ffedc8',
				'400': '#ffe4ae',
				'500': 'FFDC95',
				'600': '#ffd47b',
				'700': '#ffcb62',
				'800': '#ffc348',
				'900': '#ffba2f',
				'A100': '#ffffff',
				'A200': '#ffffff',
				'A400': '#ffffff',
				'A700': '#ffb215'
			};


		$mdThemingProvider.definePalette('customPrimary', customPrimary);
		$mdThemingProvider.definePalette('customAccent', customAccent);
		$mdThemingProvider.definePalette('customWarn', customWarn);
		$mdThemingProvider.definePalette('customBackground', customBackground);
		$mdThemingProvider.theme('default')
			.primaryPalette('customPrimary')
			.accentPalette('customAccent')
			.warnPalette('customWarn')
			.backgroundPalette('customBackground')
	}
})();