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
var SerialComponent = (function () {
    function SerialComponent(_route, _serialService) {
        this._route = _route;
        this._serialService = _serialService;
        this.serialId = null;
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
        });
    };
    SerialComponent.prototype.showFullDescription = function () {
        this.descriptionBrief = this.serial.description;
    };
    SerialComponent.prototype.showFullPlot = function () {
        this.plotBrief = this.serial.plot;
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
        serial_service_1.SerialService])
], SerialComponent);
exports.SerialComponent = SerialComponent;
//# sourceMappingURL=serial.component.js.map