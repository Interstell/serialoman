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
var episode_service_1 = require("./episode.service");
var router_1 = require("@angular/router");
var EpisodeComponent = (function () {
    function EpisodeComponent(_route, _router, _episodeService) {
        this._route = _route;
        this._router = _router;
        this._episodeService = _episodeService;
    }
    EpisodeComponent.prototype.fetchData = function () {
        var _this = this;
        this._episodeService.getEpisodesWithStrictParams(this.serial_id, this.season, this.episode_number)
            .then(function (episodes) {
            if (episodes.length == 0) {
                return _this._router.navigate(['/']);
            }
            _this.all_episodes = episodes;
            _this.episode = episodes[0];
            if (episodes.length > 1) {
                var lfEpisodes = episodes.filter(function (episode) { return episode.source == 'lostfilm'; });
                if (lfEpisodes.length) {
                    _this.episode = lfEpisodes[0];
                }
            }
        });
    };
    EpisodeComponent.prototype.goToSerial = function () {
        this._router.navigate(['/serials/' + this.serial_id + '-' + this.episode.serial_orig_name.toLowerCase().replace(/[ &:]/g, '-')]);
    };
    EpisodeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this._route.params.subscribe(function (params) {
            _this.serial_id = +params['serial_id'];
            _this.season = +params['season'];
            _this.episode_number = +params['episode'];
            _this.fetchData();
        });
    };
    EpisodeComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    return EpisodeComponent;
}());
EpisodeComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/episode/episode.component.html',
        styleUrls: ['app/episode/episode.component.css']
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        router_1.Router,
        episode_service_1.EpisodeService])
], EpisodeComponent);
exports.EpisodeComponent = EpisodeComponent;
//# sourceMappingURL=episode.component.js.map