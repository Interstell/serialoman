import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/do'
import {ISerial} from "./serial";

@Injectable()
export class SerialService{
    constructor(private _http: Http){}

    getSerialsBriefly(): Observable<ISerial[]>{
        return this._http.get('/api/serials?briefly=true')
            .map((response: Response) => <ISerial[]>response.json())
            .catch(this.handleError);
    }

    getSerialById(id: number): Observable<ISerial>{
        return this._http.get('/api/serials/serial_id/'+id)
            .map((response: Response) => <ISerial>response.json())
            .catch(this.handleError);
    }

    private handleError(error : Response){
        return Observable.throw(error.json().error || 'Server error');
    }
}