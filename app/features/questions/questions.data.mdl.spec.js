(function() {

    var
        tag1 = 'adb875bf-0a1e-4696-b235-a01756d51b28',
        tag2 = '723494d3-e232-4a26-9368-9cda1ba0a8bf',
        tagsStub = [tag1, tag2],
        question1 = {
            "id": 1001,
            "stem": "1901ed49-f4e6-473e-9710-307de3e0cff2",
            "alternates": [{
                "id": 1,
                "text": "139bd180",
                "description": "139bd180-1a91-471e-b5a4-fdae5a55ceca"
            }, {
                "id": 2,
                "text": "5eeb8b66",
                "description": "5eeb8b66-aaa9-4e20-87ae-43cc910204f1"
            }, {
                "id": 3,
                "text": "96ed4192",
                "description": "96ed4192-93c4-4905-b011-7825affdcd9a"
            }, {
                "id": 4,
                "text": "e9880457",
                "description": "e9880457-340e-411c-a2b1-a2b0497874fb"
            }],
            "correct": {
                "id": 6,
                "text": "d87d9a96",
                "description": "d87d9a96-1322-43dd-838c-e5d7f8ee1c8a"
            },
            "tags": [
                tag1,
                tag2
            ]
        },
        question2 = {
            "id": 1002,
            "stem": "0b9ac831-6546-43b7-b7cc-ad9a984d18e1",
            "alternates": [{
                "id": 1,
                "text": "7fee7518",
                "description": "7fee7518-b2f8-47fb-984d-783d1a6f9b6c"
            }, {
                "id": 2,
                "text": "be3ae3d8",
                "description": "be3ae3d8-d63f-4f97-ae4d-1f826594860e"
            }, {
                "id": 3,
                "text": "0494bdef",
                "description": "0494bdef-2229-4816-9d86-4ed492daca9f"
            }, {
                "id": 4,
                "text": "95794dcb",
                "description": "95794dcb-d96b-40d4-946d-1bc5990e013a"
            }],
            "correct": {
                "id": 6,
                "text": "8603c1a8",
                "description": "8603c1a8-d106-453b-a4be-d9e6ca324d19"
            },
            "tags": [tag2]
        },
        questionsStub = [question1, question2],
        wtJsonLoaderStub = sinon.stub().returnsPromise();


    _T.createModuleTest('wt.questions.data')
        .injectService({
            name: 'wtJsonLoader',
            value: wtJsonLoaderStub
        })
        .describe(function() {
            var moduleTest = this;

            beforeEach(function() {
                wtJsonLoaderStub.resolves(questionsStub);
            });

            moduleTest
                .createServiceTest('wtQuestionModelsResolver')
                .describe(function() {
                    var serviceTest = this,
                        result;

                    beforeEach(function() {
                        serviceTest.angularService
                            .then(function(data) {
                                result = data;
                            });
                        moduleTest.$rootScope.$apply();
                    });

                    it('Should return all questions', function() {
                        result.length.should.be.equal(questionsStub.length);
                        result.forEach(function(item, index) {
                            (item.stem === question1.stem || item.stem === question2.stem).should.be.true;
                            item.selections.length.should.be.equal(4);
                            item.selected.should.be.equal(-1);
                        })
                    })
                });

            moduleTest
                .createServiceTest('wtQuestionTagsResolver')
                .describe(function() {
                    var serviceTest = this,
                        result;

                    beforeEach(function() {
                        serviceTest.angularService
                            .then(function(data) {
                                result = data;
                            });
                        moduleTest.$rootScope.$apply();
                    });

                    it('Should return all tags', function() {
                        result.length.should.be.equal(tagsStub.length);
                        result.forEach(function(item, index) {
                            (item === tag1 || item === tag2).should.be.true;
                        })
                    })
                });
        });
})();
