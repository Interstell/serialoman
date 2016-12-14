import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import '../rxjs.operators'
import {IUser} from "./user";

@Injectable()
export class UserService{
    public user : IUser = null;

    constructor(private _http: Http){}


    register(userObject: Object):Promise<IUser>{
        return this._http.post('/api/users/register', userObject).toPromise().then(res => res.json() || {});
    }


    login(email: string, password: string):Promise<IUser>{
        return this._http.post('/api/users/login', {email, password}).toPromise().then(res => res.json() || {})
    };

    logout():Promise<any>{
        return this._http.get('/api/users/logout').toPromise();
    }

    getUserInfo():Promise<any>{
        return this._http.get('/api/user').toPromise().then(res => res.json() || {});
    }
}