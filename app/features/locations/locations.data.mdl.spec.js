(function() {

	var
		parentKey = '4d',
		parentLocation = {
			"key": parentKey,
			"value": '4d323dae-8da0-4c17-92cc-fbe8d8aa56fe',
			"description": 'bf883e50-6f57-4f66-8ba6-5f4209926e25',
			"lat": 51.0850942,
			"lon": 5.9671258,
			"zoom": 6
		},
		childKey = '72',
		parentChildKey = parentKey + '-' + childKey,
		childLocation = {
			"key": parentChildKey,
			"value": '72a18f99-f5a7-40a3-b371-b8edbae888d4',
			"description": '97bc2e7d-3a0b-47f9-ab3b-6654cba8a89b',
			"lat": 51.0124568,
			"lon": 5.365481,
			"zoom": 99
		},
		locationsStub = [parentLocation, childLocation],
		wtJsonLoaderResponse = sinon.stub().returnsPromise(),
		wtJsonLoaderStub = sinon.stub().returnsPromise();

	_T.createModuleTest('wt.locations.data')
		.injectService({
			name: 'wtJsonLoader',
			value: wtJsonLoaderStub
		})
		.describe(function() {
			var moduleTest = this;

			moduleTest
				.createServiceTest('wtLocationsHashResolver')
				.describe(function() {
					var serviceTest = this,
						result;

					beforeEach(function() {
						wtJsonLoaderStub.resolves(locationsStub);
						serviceTest.angularService
							.then(function(data) {
								result = data;
							});
						moduleTest.$rootScope.$apply();
					});

					it('should return parent location', function() {
						result[parentKey].childKey.should.be.equal(parentKey);
						result[parentKey].description.should.be.equal(parentLocation.description);
						result[parentKey].key.should.be.equal(parentKey);
						expect(result[parentKey].parentKey).to.be.null;
						result[parentKey].value.should.be.equal(parentLocation.value);
					})

					it('should return child location', function() {
						result[parentChildKey].childKey.should.be.equal(childKey);
						result[parentChildKey].description.should.be.equal(childLocation.description);
						result[parentChildKey].key.should.be.equal(parentChildKey);
						result[parentChildKey].parentKey.should.be.equal(parentKey);
						result[parentChildKey].value.should.be.equal(childLocation.value);
					})
				});


			moduleTest
				.createServiceTest('wtCountriesResolver')
				.describe(function() {
					var serviceTest = this,
						result;

					beforeEach(function() {
						wtJsonLoaderStub.resolves(locationsStub);
						serviceTest.angularService
							.then(function(data) {
								result = data;
							});
						moduleTest.$rootScope.$apply();
					});

					it('should return parent locations as array of key/values', function() {
						result[0].key.should.be.equal(parentKey);
						result[0].value.should.be.equal(parentLocation.value);
					})
				});


		});
})();