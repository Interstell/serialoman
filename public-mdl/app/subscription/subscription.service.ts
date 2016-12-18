import {IWMSubscription} from "./subscription";
import '../rxjs.operators';
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
@Injectable()
export class SubscriptionService{
    constructor(private _http: Http){}

    getSubscriptions(): Promise<IWMSubscription[]>{
        return this._http.get(`/api/subscriptions/`)
            .toPromise()
            .then(res => res.json() || {});
    }

    addSubscription(subscription : any) : Promise<IWMSubscription>{
        return this._http.post('/api/subscriptions/', subscription)
            .toPromise()
            .then(res => res.json() || {});
    }

    updateSubscription(subscription : IWMSubscription) : Promise<IWMSubscription>{
        return this._http.post('/api/subscriptions?_method=PUT', subscription)
            .toPromise()
            .then(res => res.json() || {});
    }

    deleteSubscription(subscription : IWMSubscription) : Promise<IWMSubscription>{
        return this._http.post('/api/subscriptions?_method=DELETE', subscription)
            .toPromise()
            .then(res => res.json() || {});
    }



}