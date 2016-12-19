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
var forms_1 = require("@angular/forms");
var user_service_1 = require("../user/user.service");
var router_1 = require("@angular/router");
var angular2_mdl_1 = require("angular2-mdl");
var RegisterComponent = (function () {
    function RegisterComponent(fb, mdlSnackbarService, _router, _userService) {
        this.fb = fb;
        this.mdlSnackbarService = mdlSnackbarService;
        this._router = _router;
        this._userService = _userService;
        this.email = new forms_1.FormControl('', forms_1.Validators.required);
        this.password1 = new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.minLength(1)]);
        this.password2 = new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.minLength(1)]);
        this.username = new forms_1.FormControl('', forms_1.Validators.required);
        this.form = fb.group({
            'email': this.email,
            'password1': this.password1,
            'password2': this.password2,
            'username': this.username
        });
    }
    RegisterComponent.prototype.register = function () {
        var _this = this;
        this._userService.register({
            email: this.email.value,
            password1: this.password1.value,
            password2: this.password2.value,
            username: this.username.value
        })
            .then(function () {
            _this.mdlSnackbarService.showSnackbar({
                message: 'Регистрация прошла успешно.',
                action: {
                    handler: function () {
                        _this._router.navigate(['/']);
                    },
                    text: 'Войти'
                }
            });
        })
            .catch(function (err) {
            console.log(err);
            _this.mdlSnackbarService.showSnackbar({
                message: JSON.parse(err._body).error,
            });
        });
    };
    RegisterComponent.prototype.ngOnInit = function () {
        var _this = this;
        setTimeout(function () {
            if (_this._userService.user) {
                _this._router.navigate(['/']);
            }
        }, 0);
    };
    return RegisterComponent;
}());
RegisterComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/register/register.component.html',
        styleUrls: ['app/register/register.component.css']
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        angular2_mdl_1.MdlSnackbarService,
        router_1.Router,
        user_service_1.UserService])
], RegisterComponent);
exports.RegisterComponent = RegisterComponent;
//# sourceMappingURL=register.component.js.map