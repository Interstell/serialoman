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
var user_service_1 = require("./user/user.service");
var angular2_mdl_1 = require("angular2-mdl");
var login_dialog_component_1 = require("./user/login-dialog.component");
var AppComponent = (function () {
    function AppComponent(_userService, _dialogService) {
        this._userService = _userService;
        this._dialogService = _dialogService;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._userService.getUserInfo()
            .then(function (user) {
            _this.user = user;
        })
            .catch(function (err) {
            _this.user = null;
        });
    };
    AppComponent.prototype.showLoginDialog = function () {
        var _this = this;
        var loginDialog = this._dialogService.showCustomDialog({
            component: login_dialog_component_1.LoginDialogComponent,
            isModal: true,
            styles: { 'width': '350px' },
            clickOutsideToClose: true,
            enterTransitionDuration: 400,
            leaveTransitionDuration: 400
        });
        loginDialog.subscribe(function (dialogReference) {
            dialogReference.onHide().subscribe(function () {
                _this.user = _this._userService.user;
            });
        });
    };
    AppComponent.prototype.logout = function () {
        var _this = this;
        this._userService.logout()
            .then(function (response) {
            _this.user = null;
            _this._userService.user = null;
        });
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'wm-app',
        templateUrl: './app/app.component.html',
        styleUrls: ['./app/app.component.css']
    }),
    __metadata("design:paramtypes", [user_service_1.UserService, angular2_mdl_1.MdlDialogService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map