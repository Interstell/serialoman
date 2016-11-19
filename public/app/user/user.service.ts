import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import {IUser} from "./user";

@Injectable()
export class UserService{
    constructor(private _http: Http){}

    register(userObject: Object):Observable<IUser>{
        return this._http.post('/api/users/register', userObject)
            .map((response: Response) => <IUser>response.json())
            .catch(this.handleError);
    }

    login(email: string, password: string):Observable<IUser>{
        return this._http.post('/api/users/login', {email, password})
            .map((response : Response) => <IUser>response.json())
            .catch(this.handleError);
    };

    logout():Observable<Response>{
        return this._http.get('/api/users/logout')
            .catch(this.handleError);
    }

    getUserInfo():Observable<any>{
        return this._http.get('/api/user')
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    private handleError(error : Response){
        return Observable.throw(error.json().error || 'Server error');
    }
}