(function() {

	var

		countryKey = '4d',
		country = {
			"key": countryKey,
			"value": '4d323dae-8da0-4c17-92cc-fbe8d8aa56fe'
		},

	key1 = '3952cf81-ddfe-4bcf-bd62-2f2dd46a3e3a',
		key2 = 'e967a1d1-5fa8-4092-93b7-4caf8848685f',
		$stateParamsStub = {
			locationKey: key1
		},
		locationsStub = {};
	locationsStub[key1] = {
		parentKey: key2,
		key: key1
	}
	locationsStub[key2] = {
		parentKey: null,
		key: key2
	}

	_T.createModuleTest('wt.locations')
		.describe(function() {
			var moduleTest = this;

			moduleTest
				.createControllerTest('wtCountries')
				.injectService({
					name: 'countries',
					value: [country]
				})
				.controllerAs('vm')
				.describe(function() {
					var controllerTest = this;

					it('should place the countries on the view model', function(){
						controllerTest.angularController.countries[0].should.be.equal(country);
					});
				});


			moduleTest
				.createControllerTest('wtLocationDetails')
				.injectService({
					name: 'locations',
					value: locationsStub
				})
				.injectService({
					name: '$stateParams',
					value: $stateParamsStub
				})
				.describe(function() {

				});
		});
})();