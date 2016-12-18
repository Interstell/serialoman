"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var serial_service_1 = require("./serial.service");
var episode_service_1 = require("../episode/episode.service");
var SerialComponent = (function () {
    function SerialComponent(_route, _router, _serialService, _episodeService) {
        this._route = _route;
        this._router = _router;
        this._serialService = _serialService;
        this._episodeService = _episodeService;
        this.serialId = null;
        this.activeSeasonTab = 1;
    }
    SerialComponent.prototype.fetchData = function () {
        var _this = this;
        this._serialService.getSerialById(this.serialId)
            .then(function (serial) {
            _this.serial = serial;
            if (serial.description) {
                _this.descriptionBrief = _this.serial.description.slice(0, 100).trim() + '...';
                _this.plotBrief = _this.serial.description.slice(0, 200).trim() + '...';
            }
            _this.seasons = Array(_this.serial.seasons_num).fill([]);
            _this._episodeService.getEpisodesBrieflyByOriginalName(_this.serial.orig_name)
                .then(function (episodes) {
                for (var i = 0; i < episodes.length - 1; i++) {
                    loop2: for (var j = i + 1; j < episodes.length; j++) {
                        if (episodes[i].episode_number === episodes[j].episode_number
                            && episodes[j].season === episodes[j].season
                            && episodes[i].source !== episodes[j].source) {
                            episodes[i] = null;
                            i++;
                            continue loop2;
                        }
                    }
                }
                episodes = episodes.filter(function (episode) { return episode; });
                var _loop_1 = function (i) {
                    _this.seasons[i] = episodes.filter(function (episode) { return episode.season == i + 1; });
                    _this.seasons[i].sort(function (a, b) { return a.episode_number - b.episode_number; });
                };
                for (var i = 0; i < _this.serial.seasons_num; i++) {
                    _loop_1(i);
                }
            });
        });
    };
    SerialComponent.prototype.showFullDescription = function () {
        this.descriptionBrief = this.serial.description;
    };
    SerialComponent.prototype.showFullPlot = function () {
        this.plotBrief = this.serial.plot;
    };
    SerialComponent.prototype.goToEpisode = function (episode) {
        this._router.navigate(["/episodes/" + this.serialId + "/" + episode.season + "/" + episode.episode_number]);
    };
    SerialComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this._route.params.subscribe(function (params) {
            _this.serialId = +params['name'].match(/([\d]+)-/)[1];
            _this.fetchData();
        });
    };
    SerialComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    SerialComponent.prototype.ngAfterViewChecked = function () {
        this.activeSeasonTab = 0;
    };
    return SerialComponent;
}());
SerialComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/serial/serial.component.html',
        styleUrls: ['app/serial/serial.component.css']
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        router_1.Router,
        serial_service_1.SerialService,
        episode_service_1.EpisodeService])
], SerialComponent);
exports.SerialComponent = SerialComponent;
//# sourceMappingURL=serial.component.js.map