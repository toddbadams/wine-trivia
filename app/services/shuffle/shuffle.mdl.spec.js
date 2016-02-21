(function() {

    var
        el1 = '953bf88c-c9cb-450e-93d6-fa8b63888317',
        el2 = 'ad856e1e-4173-4772-8c57-f0afdc721c7c',
        el3 = 'c5282e00-f7cc-4095-b007-899a48aec330',
        maxLength = 2,
        arr = [el1, el2, el3];

    _T.createModuleTest('wt.shuffle')
        .describe(function() {
            var moduleTest = this;

            moduleTest
                .createServiceTest('wtShuffle')
                .describe(function() {
                    var serviceTest = this,
                        result;

                    it('Should create same length array', function() {
                        result = serviceTest.angularService(arr);
                        result.length.should.equal(arr.length);
                    })

                    it('Should have same elements', function() {
                        result = serviceTest.angularService(arr);
                        result.forEach(function(item) {
                            expect(arr.indexOf(item)).not.to.be.equal(-1);
                        });
                    })
                    describe('When limiting the result length, the result', function() {


                        it('Should have the specified length', function() {
                            result = serviceTest.angularService(arr, maxLength);
                            result.length.should.equal(maxLength);
                        })

                        it('Should have elements that exist in the original array', function() {
                            result = serviceTest.angularService(arr);
                            result.forEach(function(item) {
                                expect(arr.indexOf(item)).not.to.be.equal(-1);
                            });
                        })

                    })
                });

        });
})();
