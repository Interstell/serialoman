import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import { Observable } from "rxjs/Observable";
import '../rxjs.operators';
import {ISerial} from "./serial";

@Injectable()
export class SerialService{
    constructor(private _http: Http){}

    getSerialsBriefly(count: number, offset:number): Promise<ISerial[]>{
        return this._http.get(`/api/serials?briefly=true&size=${count}&offset=${offset}`)
            .toPromise()
            .then(res => res.json() || {});
    }

    getSerialById(id: number): Promise<ISerial>{
        return this._http.get('/api/serials/serial_id/'+id)
            .toPromise()
            .then(res => res.json() || {});
    }

    getPopularSerials():Promise<ISerial[]> {
        return this._http.get('/api/serials?briefly=true&is_on_air=true')
            .toPromise()
            .then(res => res.json() || {});
    }

    getArchiveSerials():Promise<ISerial[]>{
        return this._http.get('/api/serials?briefly=true&is_on_air=false')
            .toPromise()
            .then(res => res.json() || {});
    }

    getSerialUrl(serial : ISerial):string{
        return '/serials/'+serial.serial_id+'-'+serial.orig_name.toLowerCase().replace(/[ &]/g,'-');
    };
}