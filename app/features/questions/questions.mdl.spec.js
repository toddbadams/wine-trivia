(function() {

    var
        tag1 = 'adb875bf-0a1e-4696-b235-a01756d51b28',
        tag2 = '723494d3-e232-4a26-9368-9cda1ba0a8bf',
        selection1 = {
            id: 1,
            text: "139bd180",
            description: "139bd180-1a91-471e-b5a4-fdae5a55ceca",
            isAnswer: false
        },
        selection2 = {
            id: 2,
            text: "5eeb8b66",
            description: "5eeb8b66-aaa9-4e20-87ae-43cc910204f1",
            isAnswer: false
        },
        selection3 = {
            id: 3,
            text: "96ed4192",
            description: "96ed4192-93c4-4905-b011-7825affdcd9a",
            isAnswer: false
        },
        selection4 = {
            id: 4,
            text: "d87d9a96",
            description: "d87d9a96-1322-43dd-838c-e5d7f8ee1c8a",
            isAnswer: true
        },

        tagsStub = [tag1, tag2],
        question1 = {
            id: 1001,
            selected: -1,
            selections: [selection1, selection2, selection3, selection4],
            stem: "1901ed49-f4e6-473e-9710-307de3e0cff2",
            tags: [tag1, tag2]
        },
        question2 = {
            id: 1002,
            selected: -1,
            selections: [selection4, selection1, selection2, selection3],
            stem: "8cc59d4b-bb6a-40b4-9727-ff22b98b3b63",
            tags: [tag2]
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


            moduleTest
                .createControllerTest('wtQuestion')
                .describe(function() {
                    var controllerTest = this,
                        vm;

                    beforeEach(function() {
                        vm = controllerTest.angularController;
                        // simulate binding this controller to directive
                        vm.model = question1;
                    });

                    it('should place the question on the view model', function() {
                        vm.model.should.be.equal(question1);
                    });

                    describe('When selecting a choice', function() {
                        beforeEach(function() {
                            vm.selected(1);
                        });

                        it('Should select', function() {
                            vm.model.selected.should.be.equal(1);
                        });

                        it('Should show selected description', function() {
                            vm.model.description.should.be.equal(selection2.description);
                        });
                    });

                    describe('When selecting a wrong choice', function() {
                        beforeEach(function() {
                            vm.selected(1);
                        });

                        it('Should mark the choice as wrong', function() {
                            vm.model.selections[1].isWrong.should.be.true;
                        });
                    });


                    describe('When selecting a correct choice', function() {
                        beforeEach(function() {
                            vm.selected(3);
                        });

                        it('Should mark the choice as correct', function() {
                            vm.model.selections[3].isWrong.should.be.false;
                        });
                    });
                   
                });
        });
})();
