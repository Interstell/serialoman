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
var http_1 = require("@angular/http");
require("../rxjs.operators");
var SerialService = (function () {
    function SerialService(_http) {
        this._http = _http;
    }
    SerialService.prototype.getSerialsBriefly = function (count, offset, search) {
        return this._http.get("/api/serials?briefly=true&size=" + count + "&offset=" + offset + "&search=" + search)
            .toPromise()
            .then(function (res) { return res.json() || {}; });
    };
    SerialService.prototype.getSerialById = function (id) {
        return this._http.get('/api/serials/serial_id/' + id)
            .toPromise()
            .then(function (res) { return res.json() || {}; });
    };
    SerialService.prototype.getPopularSerials = function () {
        return this._http.get('/api/serials?briefly=true&is_on_air=true')
            .toPromise()
            .then(function (res) { return res.json() || {}; });
    };
    SerialService.prototype.getArchiveSerials = function () {
        return this._http.get('/api/serials?briefly=true&is_on_air=false')
            .toPromise()
            .then(function (res) { return res.json() || {}; });
    };
    SerialService.prototype.getSerialUrl = function (serial) {
        return '/serials/' + serial.serial_id + '-' + serial.orig_name.toLowerCase().replace(/[ &]/g, '-');
    };
    ;
    return SerialService;
}());
SerialService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], SerialService);
exports.SerialService = SerialService;
//# sourceMappingURL=serial.service.js.map