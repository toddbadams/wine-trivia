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
        $stateParamsStub = {
            tag: 'all'
        };


    _T.createModuleTest('wt.questions')
        .describe(function() {
            var moduleTest = this;

            moduleTest
                .createControllerTest('wtQuestions')
                .injectService({
                    name: '$stateParams',
                    value: $stateParamsStub
                })
                .injectService({
                    name: 'questions',
                    value: questionsStub
                })
                .describe(function() {
                    var controllerTest = this,
                        vm;

                    beforeEach(function() {
                        vm = controllerTest.angularController;
                    });

                    it('should place the questions on the view model', function() {
                        vm.questions.should.be.equal(questionsStub);
                    });

                    it('should set the current question to the first', function() {
                        vm.index.should.be.equal(0);
                        vm.current.should.be.equal(questionsStub[0]);
                    });

                    describe('When moving to the previous question', function() {
                        beforeEach(function() {
                            vm.index = 1;
                            vm.current = vm.questions[1];
                            vm.previous();
                        });

                        it('Should show the previous question', function() {
                            vm.index.should.be.equal(0);
                            vm.current.should.be.equal(questionsStub[0]);
                        });
                    });

                    describe('When viewing the first question', function() {
                        beforeEach(function() {
                            vm.index = 1;
                            vm.current = vm.questions[1];
                            vm.previous();
                        });

                        it('Should not display the previous button', function() {
                            vm.showPrevious.should.be.false;
                        });
                    });

                    describe('When moving to the next question', function() {
                        beforeEach(function() {
                            vm.index = 0;
                            vm.current = vm.questions[0];
                            vm.next();
                        });

                        it('Should show the next question', function() {
                            vm.index.should.be.equal(1);
                            vm.current.should.be.equal(questionsStub[1]);
                        });
                    });

                    describe('When viewing the last question', function() {
                        beforeEach(function() {
                            vm.index = questionsStub.length - 2;
                            vm.current = vm.questions[vm.index];
                            vm.next();
                        });

                        it('Should not display the next button', function() {
                            vm.showNext.should.be.false;
                        });
                    });
                });
        });
})();
