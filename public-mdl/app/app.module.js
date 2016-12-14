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
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var platform_browser_1 = require("@angular/platform-browser");
var app_component_1 = require("./app.component");
var main_component_1 = require("./main/main.component");
var angular2_mdl_1 = require("angular2-mdl");
var user_service_1 = require("./user/user.service");
var login_dialog_component_1 = require("./user/login-dialog.component");
var serial_component_1 = require("./serial/serial.component");
var serial_service_1 = require("./serial/serial.service");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            http_1.HttpModule,
            forms_1.ReactiveFormsModule,
            angular2_mdl_1.MdlModule,
            router_1.RouterModule.forRoot([
                { path: 'serials/:name', component: serial_component_1.SerialComponent },
                { path: '', component: main_component_1.MainComponent, pathMatch: 'full' },
                { path: '**', redirectTo: '', pathMatch: 'full' }
            ])
        ],
        declarations: [
            app_component_1.AppComponent,
            main_component_1.MainComponent,
            login_dialog_component_1.LoginDialogComponent,
            serial_component_1.SerialComponent
        ],
        entryComponents: [login_dialog_component_1.LoginDialogComponent],
        providers: [
            user_service_1.UserService,
            serial_service_1.SerialService
        ],
        bootstrap: [app_component_1.AppComponent]
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map