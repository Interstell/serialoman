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
var serial_service_1 = require("../serial/serial.service");
var HeaderComponent = (function () {
    function HeaderComponent(_serialService) {
        this._serialService = _serialService;
        this.pageTitle = 'Serialoman';
    }
    HeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._serialService.getSerialsBriefly()
            .subscribe(function (serials) { return _this.briefSerials = serials; }, function (error) { return console.error(error); });
    };
    HeaderComponent.prototype.ngAfterViewInit = function () {
        $('.button-collapse').sideNav({
            menuWidth: 300
        });
        $('.collapsible').collapsible();
    };
    return HeaderComponent;
}());
HeaderComponent = __decorate([
    core_1.Component({
        selector: 'sm-header',
        templateUrl: './app/header/header.component.html',
        styleUrls: ['./app/header/header.component.css']
    }),
    __metadata("design:paramtypes", [serial_service_1.SerialService])
], HeaderComponent);
exports.HeaderComponent = HeaderComponent;
//# sourceMappingURL=header.component.js.map