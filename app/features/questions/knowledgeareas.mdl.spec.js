(function() {

    var
        area1 = 'd74e0156-48f4-42f1-9967-a1cce994e628',
        area2 = '8cc59d4b-bb6a-40b4-9727-ff22b98b3b63',
        area3 = '5abf3936-bdc7-4825-b683-52784569f710',
        areas = [area1, area2, area3];

    _T.createModuleTest('wt.knowledgeAreas')
        .describe(function() {
            var moduleTest = this;

            moduleTest
                .createControllerTest('wtKnowledgeAreas')
                .controllerAs('vm')
                .injectService({
                    name: 'areas',
                    value: areas
                })
                .describe(function() {
                	var controllerTest = this;

                	it('Should place the areas on the view model.', function(){
            			controllerTest.angularController.areas.should.be.equal(areas);
                	});

                });
        });
})();
