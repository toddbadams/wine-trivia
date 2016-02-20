(function() {

	var

		countryKey = '4d',
		country = {
			"key": countryKey,
			"value": '4d323dae-8da0-4c17-92cc-fbe8d8aa56fe'
		},

		key1 = '51',
		location1 = {
			childKey: key1,
			key: key1,
			parentKey: null,
			value: '51c0465a-2ece-4b8f-97a4-f94cf187a471'
		},
		key2 = 'e96',
		key1Key2 = key1 + '-' + key2,
		location2 = {
			childKey: key2,
			key: key1Key2,
			parentKey: key1,
			value: 'e967a1d1-5fa8-4092-93b7-4caf8848685f'
		},
		key3 = '4cb',
		key1key2Key3 = key1 + '-' +key2 + '-' + key3,
		location3 = {
			childKey: key3,
			key: key1key2Key3,
			parentKey: key2,
			value: '4cbd8ad5-6883-410e-ba01-c28c1d76f0fb'
		},
		locationsStub = {},
		$stateParamsStub = {
			locationKey: key1Key2
		};

	locationsStub[key1] = location1;
	locationsStub[key1Key2] = location2;
	locationsStub[key1key2Key3] = location3;

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

					it('should place the countries on the view model', function() {
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
					var controllerTest = this;

					it('should place the loctions on the view model', function() {
						controllerTest.angularController.locations[key1]
							.should.be.equal(location1);
						controllerTest.angularController.locations[key1Key2]
							.should.be.equal(location2);
						controllerTest.angularController.locations[key1key2Key3]
							.should.be.equal(location3);
					});

					it('should set the current location', function() {
						controllerTest.angularController.current
							.should.be.equal(location2);
					});

					it('should set the parent location', function() {
						controllerTest.angularController.parent
							.should.be.equal(location1);
					});

					it('should set the children locations', function() {
						controllerTest.angularController.children[0]
							.should.be.equal(location3);
					});
				});
		});
})();