(function() {

	var
		key1 = '3952cf81-ddfe-4bcf-bd62-2f2dd46a3e3a',
		key2 = 'e967a1d1-5fa8-4092-93b7-4caf8848685f',
		$stateParamsStub = {
			locationKey: key1
		},
		locationsStub = {},
		varietiesStub = {
			CHA: {
				"key": "CHA",
				"value": "Chardonnay",
				"color": "WH",
				"description": "Chardonnay is a green-skinned grape variety used to make white wine. It originated in the Burgundy wine region of eastern France but is now grown wherever wine is produced.",
				"pronounce": "shar-dun-nay",
				"regions": [{
					"key": "FR-BUR-CHA",
					"isPremium": true,
					"primary": ["green apple", "lemon", "lime", "quince"],
					"secondary": [],
					"tertiary": ["honey"]
				}, {
					"key": "FR-BUR-PUL",
					"isPremium": true
				}, {
					"key": "FR-BUR-MER",
					"isPremium": true
				}, {
					"key": "FR-BUR-MAC",
					"isPremium": true
				}, {
					"key": "FR-BUR-POU",
					"isPremium": true
				}, {
					"key": "FR-PAY",
					"isPremium": false
				}],
				"blends": ["SEM"]
			}
		};
	locationsStub[key1] = {
		parentKey: key2,
		key: key1
	};
	locationsStub[key2] = {
		parentKey: null,
		key: key2
	};

//	_T.createModuleTest('wt.varieties')
//		.describe(function() {
//			var moduleTest = this;
//
//			moduleTest
//				.createControllerTest('wtVarieties')
//				.injectService({
//					name: 'data',
//					value: varietiesStub
//				})
//				.injectService({
//					name: 'locations',
//					value: locationsStub
//				})
//				.describe(function() {

//				});
//		});
})();