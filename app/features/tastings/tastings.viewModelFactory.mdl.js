(function() {
    'use strict';
    var
        ALL = 'all',
        WHITE = 'white',
        ROSE = 'rose',
        RED = 'red';

    angular.module('wt.tastings.viewModelFactory', [])
        .factory('wtTastingsViewModelFactory', wtTastingsViewModelFactory);

    wtTastingsViewModelFactory.$inject = [];

    function wtTastingsViewModelFactory() {

        var TastingsVm = (function() {


            var TastingsVm = function(data) {
                this.data = (!angular.isArray(this.data) ? data : []);
                this.index = -1;
                this.tastings = [];
            }

            TastingsVm.prototype.create = function(location, variety) {
                location = location || ALL;
                variety = variety || ALL;
                this.index = 0;
                this.tastings = filterByVariety(filterByLocation(this.data, location), variety)
                    .map(function(item) {
                        return new Tasting(item)
                    });
            }

            TastingsVm.prototype.selectTasting = function(index) {
                if (index < 0 || index > this.tastings.length - 1) return;
                this.index = index;
            }

            function filterByLocation(data, location) {
                if (location === ALL) return data;
                return data.map(function(tasting) {
                    if (tasting.location === location) {
                        return tasting;
                    }
                });
            }

            function filterByVariety(data, variety) {
                if (variety === ALL) return data;
                return data.map(function(tasting) {
                    if (tasting.variety === variety) {
                        return tasting;
                    }
                });
            }

            var Tasting = function(data) {
                this.data = data;
                this.appearance = new Appearance(data.appearance);
                this.nose = new Nose(data.nose);
                this.palate = new Palate(data.palate);
                this.location = data.location;
                this.variety = data.variety;
                return this;
            };

            var Appearance = function(data) {
                this.data = data;
                this.intensity = new Range(data.intensity, ['pale', 'medium', 'deep']);
                this.type = data.type;
                switch (this.type) {
                    case WHITE:
                        this.color = new Range(data.color, ['lemon-green', 'lemon', 'gold', 'amber', 'brown']);
                        break;
                    case ROSE:
                        this.color = new Range(data.color, ['pink', 'salmon', 'orange']);
                        break;
                    case RED:
                        this.color = new Range(data.color, ['purple', 'ruby', 'garnet', 'tawny', 'brown']);
                }
            };

            var Nose = function(data){
            	this.data = data;
            	this.intensity = new Range(data.intensity, ['light', 'medium-', 'medium', 'medium+', 'pronounced']);
            	this.aromas = data.aromas;
            }

            var Palate = function(data){
            	this.data = data;
            	this.sweetness = new Range(data.sweetness, ['dry', 'off-dry', 'medium-dry', 'off-sweet', 'sweet', 'luscious']);
            	this.acidity = new Range(data.acidity, ['low', 'medium-', 'medium', 'medium+', 'high']);
            	this.tannin = new Range(data.tannin, ['low', 'medium-', 'medium', 'medium+', 'high']);
            	this.alcohol = new Range(data.alcohol, ['low', 'medium-', 'medium', 'medium+', 'high']);
            	this.body = new Range(data.body, ['low', 'medium-', 'medium', 'medium+', 'high']);
            	this.intensity = new Range(data.intensity, ['light', 'medium-', 'medium', 'medium+', 'pronounced']);
            	this.finish = new Range(data.finish, ['dry', 'off-dry', 'medium-dry', 'off-sweet', 'sweet', 'luscious']);
            	this.flavours = data.flavours;
            }


            var Range = function(data, range) {
                this.data = data;
                this.from = Math.floor(data / 100);
                this.to = Math.floor((data - this.from * 100) / 10);
                this.max = data - this.from * 100 - this.to * 10;
                this.range = range;
                this.description = (this.from === this.to) ?
                    this.range[this.from-1] :
                    this.range[this.from-1] + ' to ' + this.range[this.to-1];
            };

            function toRange(range) {
                return
            }
            return TastingsVm;
        })();

        return function(data) {
            return new TastingsVm(data);
        }
    }


})();
