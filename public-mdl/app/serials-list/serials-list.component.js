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
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var SerialsListComponent = (function () {
    function SerialsListComponent(_route, _router, _formBuilder, _serialService) {
        this._route = _route;
        this._router = _router;
        this._formBuilder = _formBuilder;
        this._serialService = _serialService;
        this.page = 1;
        this.resultsOnPage = 15;
        this.serials = null;
        this.searchString = new forms_1.FormControl('');
    }
    SerialsListComponent.prototype.fetchData = function () {
        var _this = this;
        this._serialService.getSerialsBriefly(this.resultsOnPage, (this.page - 1) * this.resultsOnPage, this.searchString.value)
            .then(function (response) {
            _this.serials = response.serials;
            _this.totalSerialsCount = response.totalCount;
        });
    };
    SerialsListComponent.prototype.getActorsShortened = function (actors) {
        return actors.replace(/ \([\wА-Яа-я ]+\)/g, '').slice(0, 100).replace(/, [\wА-Яа-я ]+$/, ' и другие. ');
    };
    SerialsListComponent.prototype.getSerialUrl = function (serial) {
        return this._serialService.getSerialUrl(serial);
    };
    SerialsListComponent.prototype.navigateToSerial = function (serial) {
        this._router.navigate([this.getSerialUrl(serial)]);
    };
    SerialsListComponent.prototype.onSubmitString = function (form) {
        var _this = this;
        this.page = 1;
        this._router.navigateByUrl("/serials/page/1?search=" + this.searchString.value).then(function () {
            _this.ngOnInit();
            //this.fetchData();
        });
    };
    SerialsListComponent.prototype.goBack = function () {
        var _this = this;
        var url;
        if (this.searchString.value) {
            url = "/serials/page/" + (this.page - 1) + "?search=" + this.searchString.value;
        }
        else
            url = "/serials/page/" + (this.page - 1);
        this._router.navigateByUrl(url).then(function () {
            _this.ngOnInit();
        });
    };
    SerialsListComponent.prototype.goForward = function () {
        var _this = this;
        var url;
        if (this.searchString.value) {
            url = "/serials/page/" + (this.page + 1) + "?search=" + this.searchString.value;
        }
        else
            url = "/serials/page/" + (this.page + 1);
        this._router.navigateByUrl(url).then(function () {
            _this.ngOnInit();
        });
    };
    SerialsListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.form = this._formBuilder.group({
            'searchString': this.searchString
        });
        this.sub = this._route.params.subscribe(function (params) {
            if (params['page']) {
                _this.page = +params['page'];
                if (_this.page <= 0)
                    return _this._router.navigate(['/serials']);
            }
            _this.subQuery = _this._route.queryParams.subscribe(function (params) {
                if (params['search']) {
                    _this.searchString.patchValue(params['search']);
                }
                _this.fetchData();
            });
        });
    };
    SerialsListComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
        this.subQuery.unsubscribe();
    };
    return SerialsListComponent;
}());
SerialsListComponent = __decorate([
    core_1.Component({
        templateUrl: './app/serials-list/serials-list.component.html',
        styleUrls: ['./app/serials-list/serials-list.component.css']
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        router_1.Router,
        forms_1.FormBuilder,
        serial_service_1.SerialService])
], SerialsListComponent);
exports.SerialsListComponent = SerialsListComponent;
//# sourceMappingURL=serials-list.component.js.map