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
var shared_service_1 = require("../shared/shared.service");
var user_service_1 = require("../user/user.service");
var HeaderComponent = (function () {
    function HeaderComponent(_serialService, _userService, _sharedService) {
        this._serialService = _serialService;
        this._userService = _userService;
        this._sharedService = _sharedService;
        this.pageTitle = 'Serialoman';
    }
    HeaderComponent.prototype.getSerialUrl = function (serial) {
        return '/serials/' + serial.serial_id + '-' + serial.orig_name.toLowerCase().replace(/[ &]/g, '-');
    };
    ;
    HeaderComponent.prototype.onLoginSubmit = function () {
        var _this = this;
        this._userService.login(this.email, this.password)
            .subscribe(function (response) {
            _this.user = response;
        });
    };
    HeaderComponent.prototype.onLogout = function () {
        var _this = this;
        this._userService.logout()
            .subscribe(function (response) {
            if (response.json().success) {
                _this.user = null;
            }
        });
    };
    HeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._serialService.getSerialsBriefly()
            .subscribe(function (serials) { return _this.briefSerials = serials; }, function (error) { return console.error(error); });
        this._userService.getUserInfo()
            .subscribe(function (value) {
            if (!value.error)
                _this.user = value;
        }, function (error) { return console.log(error); });
    };
    HeaderComponent.prototype.ngAfterViewInit = function () {
        $('.button-collapse').sideNav({
            menuWidth: 300
        });
        setTimeout(function () {
            $('.collapsible').collapsible();
        }, 250);
        $('.modal').modal();
    };
    return HeaderComponent;
}());
HeaderComponent = __decorate([
    core_1.Component({
        selector: 'sm-header',
        templateUrl: './app/header/header.component.html',
        styleUrls: ['./app/header/header.component.css']
    }),
    __metadata("design:paramtypes", [serial_service_1.SerialService,
        user_service_1.UserService,
        shared_service_1.SharedService])
], HeaderComponent);
exports.HeaderComponent = HeaderComponent;
//# sourceMappingURL=header.component.js.map