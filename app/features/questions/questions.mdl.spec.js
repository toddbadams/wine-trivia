var moduleTest = this,
    wtQuestionDataResolverStub = chance.hash(),
    questionsModelStub = {
        createQuestions: sinon.stub()
    },
    wtQuestionsViewModelFactoryStub = sinon.stub()
    .returns(questionsModelStub),
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
                name: 'wtQuestionDataResolver',
                value: wtQuestionDataResolverStub
            })
            .injectService({
                name: 'wtQuestionsViewModelFactory',
                value: wtQuestionsViewModelFactoryStub
            })
            .describe(function() {
                var controllerTest = this,
                    vm;

                beforeEach(function() {
                    vm = controllerTest.angularController;
                });

                it('should place the questions on the view model', function() {
                    wtQuestionsViewModelFactoryStub.should.be.called;
                    questionsModelStub.createQuestions.should.be.called;
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
