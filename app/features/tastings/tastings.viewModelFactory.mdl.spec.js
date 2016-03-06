_T.createModuleTest('wt.tastings.viewModelFactory')
    .describe(function() {
        var moduleTest = this,
            tastingsData;

        function range(max) {
            var hundreds = chance.integer({ min: 1, max: max }),
                tens = chance.integer({ min: hundreds, max: max });
            return hundreds * 100 + tens * 10 + max;
        }

        function words(qnty) {
            var result = [];
            for (var i = 0; i < qnty; i += 1) {
                result.push(chance.word());
            }
            return result;
        }

        function wordsArray(qnty1, qnty2, qnty3) {
            return [words(qnty1), words(qnty2), words(qnty3)];
        }

        function createTastings(qnty) {
            var t = [],
                i;
            for (i = 0; i < qnty; i++) {
                t.push({
                    location: chance.word(),
                    variety: chance.word(),
                    appearance: {
                        intensity: range(3),
                        color: range(5)
                    },
                    nose: {
                        intensity: range(5),
                        aroma: wordsArray(4, 3, 3)
                    },
                    palate: {
                        sweetness: range(6),
                        acidity: range(5),
                        body: range(5),
                        intensity: range(5),
                        finish: range(5),
                        tannin: range(5),
                        flavours: wordsArray(4, 3, 3)
                    }
                });
            }
            return t;
        }

        beforeEach(function() {
            tastingsData = createTastings(2);
        });

        moduleTest
            .createServiceTest('wtTastingsViewModelFactory')
            .describe(function() {
                var serviceTest = this,
                    vm;

                beforeEach(function() {
                    vm = serviceTest.angularService(tastingsData);
                });

                it('Should create a tastings view model', function() {
                    expect(vm).not.to.be.null;
                    expect(vm).not.to.be.undefined;
                });

                describe('The tastings view model', function() {

                    it('should contain the tastings data', function() {
                        vm.data.should.equal(tastingsData);
                    });

                    it('should NOT contain tastings models', function() {
                        vm.tastings.length.should.equal(0);
                    });
                });

                describe('When creating tastings, the view model', function() {
                    beforeEach(function() {
                        vm.create();
                    });

                    it('should have the same number of tastings as the data', function() {
                        vm.tastings.length.should.equal(tastingsData.length);
                    });

                    it('should set the current tasting to the first', function() {
                        vm.index.should.be.equal(0);
                    });

                    describe('Each tasting', function() {
                        var tasting,
                            data;

                        beforeEach(function() {
                            tasting = vm.tastings[0];
                            data = tastingsData[0];
                        });

                        it('should have the tasting data', function() {
                            tasting.data.should.equal(data);
                        });

                        it('should have a location', function() {
                            tasting.location.should.equal(data.location);
                        });

                        it('should have a variety', function() {
                            tasting.variety.should.equal(data.variety);
                        });

                        describe('Each tasting appearance', function() {
                            it('should have the appearance data', function() {
                                tasting.appearance.data.should.equal(data.appearance);
                            });
                            it('should have the appearance data', function() {
                                tasting.appearance.data.should.equal(data.appearance);
                            });

                            describe('The intensity', function() {
                                var expectedFrom,
                                    expectedTo,
                                    expectedMax,
                                    expectedDescription;

                                beforeEach(function() {
                                    expectedFrom = Math.floor(data.appearance.intensity / 100);

                                    expectedTo = Math.floor((data.appearance.intensity -
                                        expectedFrom * 100) / 10);

                                    expectedMax = data.appearance.intensity -
                                        expectedFrom * 100 -
                                        expectedTo * 10;

                                    expectedDescription = (expectedTo === expectedFrom) ?
                                        tasting.appearance.intensity.range[expectedTo - 1] :
                                        tasting.appearance.intensity.range[expectedFrom - 1] + ' to ' +
                                        tasting.appearance.intensity.range[expectedTo - 1];
                                });

                                it('should have the intensity data', function() {
                                    tasting.appearance.intensity.data.should.equal(data.appearance.intensity);
                                });
                                it('should have a from number', function() {
                                    tasting.appearance.intensity.from.should.equal(expectedFrom);
                                });
                                it('should have a to number', function() {
                                    tasting.appearance.intensity.to.should.equal(expectedTo);
                                });
                                it('should have a max number', function() {
                                    tasting.appearance.intensity.max.should.equal(expectedMax);
                                });
                                it('should have a description', function() {
                                    tasting.appearance.intensity.description.should.equal(expectedDescription);
                                });
                            });
                        });

                    });
                });
            });
    });
