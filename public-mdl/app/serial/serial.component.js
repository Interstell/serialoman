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
var subscription_service_1 = require("../subscription/subscription.service");
var user_service_1 = require("../user/user.service");
var angular2_mdl_1 = require("angular2-mdl");
var SerialComponent = (function () {
    function SerialComponent(_route, _router, _serialService, _episodeService, _userService, _subscriptionService, _mdlSnackbarService) {
        this._route = _route;
        this._router = _router;
        this._serialService = _serialService;
        this._episodeService = _episodeService;
        this._userService = _userService;
        this._subscriptionService = _subscriptionService;
        this._mdlSnackbarService = _mdlSnackbarService;
        this.serialId = null;
        this.lostfilmTranslates = false;
        this.newstudioTranslates = false;
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
            _this.user = _this._userService.user;
            _this._episodeService.getEpisodesBrieflyByOriginalName(_this.serial.orig_name)
                .then(function (episodes) {
                episodes.forEach(function (episode) {
                    if (episode.source == 'newstudio')
                        _this.newstudioTranslates = true;
                    if (episode.source == 'lostfilm')
                        _this.lostfilmTranslates = true;
                });
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
                _this.fetchSubscriptionData();
            });
        });
    };
    SerialComponent.prototype.fetchSubscriptionData = function () {
        var _this = this;
        this._subscriptionService.getSubscriptions()
            .then(function (subscriptions) {
            _this.subscription = subscriptions.find(function (sub) { return sub.serial_orig_name == _this.serial.orig_name; });
            if (!_this.subscription)
                return _this.subscription = null;
            var ns = _this.subscription.episode_sources.find(function (sc) { return sc == 'newstudio'; });
            if (ns)
                _this.newstudioSubscribed = true;
            var lf = _this.subscription.episode_sources.find(function (lf) { return lf == 'lostfilm'; });
            if (lf)
                _this.lostfilmSubscribed = true;
        });
    };
    SerialComponent.prototype.subscribeForSerial = function () {
        var _this = this;
        var sources = [];
        if (this.lostfilmTranslates)
            sources.push('lostfilm');
        if (this.newstudioTranslates)
            sources.push('newstudio');
        this._subscriptionService.addSubscription({
            serial_orig_name: this.serial.orig_name,
            episode_sources: sources,
            notification_methods: ['email']
        }).then(function (subscription) {
            _this.subscription = subscription;
            _this._mdlSnackbarService.showSnackbar({
                message: 'Вы успешно подписались на выход новых серий.'
            });
            _this.fetchSubscriptionData();
        });
    };
    SerialComponent.prototype.unsubcribeOfSerial = function () {
        var _this = this;
        this._subscriptionService.deleteSubscription(this.subscription)
            .then(function (subscription) {
            _this.subscription = null;
            _this._mdlSnackbarService.showSnackbar({
                message: 'Вы успешно отписались.'
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
    SerialComponent.prototype.saveSubscription = function () {
        var _this = this;
        var sourceArr = [];
        if (this.lostfilmSubscribed)
            sourceArr.push('lostfilm');
        if (this.newstudioSubscribed)
            sourceArr.push('newstudio');
        this.subscription.episode_sources = sourceArr;
        this._subscriptionService.updateSubscription(this.subscription)
            .then(function (subscription) {
            _this.subscription = subscription;
            _this._mdlSnackbarService.showSnackbar({
                message: 'Изменения в подписке сохранены.'
            });
        })
            .catch(function () {
            _this._mdlSnackbarService.showSnackbar({
                message: 'Внутренняя ошибка сервера.'
            });
        });
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
        episode_service_1.EpisodeService,
        user_service_1.UserService,
        subscription_service_1.SubscriptionService,
        angular2_mdl_1.MdlSnackbarService])
], SerialComponent);
exports.SerialComponent = SerialComponent;
//# sourceMappingURL=serial.component.js.map