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
var angular2_mdl_1 = require("angular2-mdl");
var user_service_1 = require("./user.service");
var forms_1 = require("@angular/forms");
var LoginDialogComponent = (function () {
    function LoginDialogComponent(dialog, _formBuilder, _userService) {
        this.dialog = dialog;
        this._formBuilder = _formBuilder;
        this._userService = _userService;
        this.email = new forms_1.FormControl('', forms_1.Validators.required);
        this.password = new forms_1.FormControl('', forms_1.Validators.required);
        this.user = null;
        this.credentialsCorrect = true;
    }
    LoginDialogComponent.prototype.login = function () {
        var _this = this;
        this._userService.login(this.email.value, this.password.value)
            .then(function (user) {
            _this._userService.user = user;
            _this.dialog.hide();
        })
            .catch(function (err) {
            _this.credentialsCorrect = false;
        });
    };
    LoginDialogComponent.prototype.onEsc = function () {
        this.dialog.hide();
    };
    LoginDialogComponent.prototype.ngOnInit = function () {
        this.form = this._formBuilder.group({
            'email': this.email,
            'password': this.password
        });
    };
    return LoginDialogComponent;
}());
__decorate([
    core_1.HostListener('keydown.esc'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LoginDialogComponent.prototype, "onEsc", null);
LoginDialogComponent = __decorate([
    core_1.Component({
        selector: 'login-dialog',
        templateUrl: './app/user/login-dialog.component.html',
        styleUrls: ['./app/user/login-dialog.component.css']
    }),
    __metadata("design:paramtypes", [angular2_mdl_1.MdlDialogReference,
        forms_1.FormBuilder,
        user_service_1.UserService])
], LoginDialogComponent);
exports.LoginDialogComponent = LoginDialogComponent;
//# sourceMappingURL=login-dialog.component.js.map