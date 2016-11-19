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
var user_service_1 = require("../user/user.service");
var router_1 = require("@angular/router");
var RegisterComponent = (function () {
    function RegisterComponent(_userService, _router) {
        this._userService = _userService;
        this._router = _router;
        this.userInput = {};
    }
    RegisterComponent.prototype.onRegisterSubmit = function () {
        var _this = this;
        this._userService.register(this.userInput)
            .subscribe(function (user) {
            console.log(user);
            _this._router.navigate(['/']);
        });
    };
    ;
    return RegisterComponent;
}());
RegisterComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/register/register.component.html'
    }),
    __metadata("design:paramtypes", [user_service_1.UserService, router_1.Router])
], RegisterComponent);
exports.RegisterComponent = RegisterComponent;
//# sourceMappingURL=register.component.js.map