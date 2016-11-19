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
var shared_service_1 = require("../shared/shared.service");
var SerialComponent = (function () {
    function SerialComponent(_route, _sharedService, _serialService) {
        this._route = _route;
        this._sharedService = _sharedService;
        this._serialService = _serialService;
        this.jqueryRan = false;
        this.serialId = null;
    }
    SerialComponent.prototype.fetchData = function () {
        var _this = this;
        this._serialService.getSerialById(this.serialId)
            .subscribe(function (serial) {
            _this.serial = serial;
            _this.seasons = new Array(serial.seasons_num);
            setTimeout(function () {
                $('ul.tabs').tabs();
            }, 0);
        }, function (error) { return console.error(error); });
    };
    SerialComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this._route.params.subscribe(function (params) {
            _this.serialId = +params['name'].match(/([\d]+)-/)[1];
            _this.fetchData();
        });
    };
    SerialComponent.prototype.ngAfterViewChecked = function () {
        if (!this.jqueryRan && this.serial) {
            this.jqueryRan = true;
            $('.collapsible').collapsible();
        }
    };
    ;
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
        shared_service_1.SharedService,
        serial_service_1.SerialService])
], SerialComponent);
exports.SerialComponent = SerialComponent;
//# sourceMappingURL=serial.component.js.map