(function() {

    var
        data = '0814f27e-9df1-42e5-95fb-e811a9128c0c',
        cacheStub = null,
        promiseStub = sinon.stub().returnsPromise(),
        createModel = function(data){
        	return {
        		isModel: true,
        		data: data
        	}
        };

    _T.createModuleTest('wt.resolver')
        .describe(function() {
            var moduleTest = this;

            moduleTest
                .createServiceTest('wtResolver')
                .describe(function() {
                    var serviceTest = this,
                        result,
                        promise;

                    beforeEach(function() {
                        cacheStub = null;
                        promiseStub.resolves(data);
                        promise = promiseStub();
                    });

                    it('Should resolve data', function() {
                        serviceTest.angularService(promise, cacheStub)
                            .then(function(data) {
                                result = data;
                            });
                        moduleTest.$rootScope.$apply();
                        result.should.be.equal(data);
                    })

                    it('Should resolve data from cache', function() {
                        cacheStub = data;
                        serviceTest.angularService(promise, cacheStub)
                            .then(function(data) {
                                result = data;
                            });
                        moduleTest.$rootScope.$apply();
                        result.should.be.equal(data);
                    })

                    it('Should resolve data with model factory', function() {
                        serviceTest.angularService(promise, cacheStub, createModel)
                            .then(function(data) {
                                result = data;
                            });
                        moduleTest.$rootScope.$apply();
                        result.isModel.should.be.true;
                        result.data.should.be.equal(data);
                    })
                });

        });
})();
