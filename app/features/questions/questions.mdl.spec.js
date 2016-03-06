var moduleTest = this,
    questions = chance.hash(),
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
                name: 'questions',
                value: questions
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
    });
