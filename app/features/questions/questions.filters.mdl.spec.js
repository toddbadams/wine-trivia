(function() {

    var
        tag1 = 'adb875bf-0a1e-4696-b235-a01756d51b28',
        tag2 = '723494d3-e232-4a26-9368-9cda1ba0a8bf',
        tagsStub = [tag1, tag2],
        question1 = {
            id: 1001,
            tags: [
                tag1,
                tag2
            ]
        },
        question2 = {
            id: 1002,
            tags: [tag2]
        },
        questionsStub = [question1, question2],
        wtJsonLoaderStub = sinon.stub().returnsPromise();


    _T.createModuleTest('wt.questions.filters')
        .describe(function() {
            var moduleTest = this;

            moduleTest
                .createServiceTest('wtQuestionsByTagFilter')
                .describe(function() {
                    var serviceTest = this,
                        result;

                    beforeEach(function() {
                    });

                    it('Should return only specified questions', function() {
                        result = serviceTest.angularService(questionsStub,tag1);
                        result.length.should.be.equal(1);
                        result[0].id.should.be.equal(question1.id);
                    })
                });
        });
})();
