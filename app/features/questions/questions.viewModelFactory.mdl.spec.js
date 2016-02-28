_T.createModuleTest('wt.questions.viewModelFactory')
    .describe(function() {
        var moduleTest = this,
            tag1,
            tag2,
            tagsStub,
            question1,
            question2,
            questionsStub;

        function createAlternates(qnty) {
            var alts = [],
                i;
            for (i = 0; i < qnty; i++) {
                alts.push({
                    id: chance.integer({ min: 1 }),
                    text: chance.sentence(),
                    description: chance.sentence()
                });
            }
            return qnty === 1 ? alts[0] : alts;
        }

        function createQuestion(qntyAlternates, qntyCorrect, tags) {
            return {
                id: chance.integer({ min: 1 }),
                stem: chance.sentence(),
                alternates: createAlternates(qntyAlternates),
                correct: createAlternates(qntyCorrect),
                tags: tags
            }
        }

        beforeEach(function() {
            tag1 = chance.word();
            tag2 = chance.word();
            tagsStub = [tag1, tag2];
            question1 = createQuestion(4, 2, [tag1, tag2]);
            question2 = createQuestion(4, 1, [tag1]);
            questionsStub = [question1, question2];
        });

        moduleTest
            .createServiceTest('wtQuestionsViewModelFactory')
            .describe(function() {
                var serviceTest = this,
                    vm;

                beforeEach(function() {
                    vm = serviceTest.angularService(questionsStub);
                });

                it('Should create a questions view model', function() {
                    expect(vm).not.to.be.null;
                    expect(vm).not.to.be.undefined;
                });

                describe('The questions view model', function() {

                    it('should contain the questions data', function() {
                        vm.data.should.equal(questionsStub);
                    });

                    it('should not contain questions models', function() {
                        vm.questions.length.should.equal(0);
                        vm.index.should.equal(-1);
                    })
                });

                describe('When Creating questions, the view model', function() {
                    beforeEach(function() {
                        vm.createQuestions();
                    });

                    it('should have the same number of questions as the data', function() {
                        vm.questions.length.should.equal(questionsStub.length);
                    });
                });
            });
    });
