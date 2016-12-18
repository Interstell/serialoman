import {Injectable} from "@angular/core";
import '../rxjs.operators';
import {Http} from "@angular/http";
import {IEpisode} from "./episode";


@Injectable()
export class EpisodeService{
    constructor(private _http: Http){}

    getEpisodesWithStrictParams(serial_id : number, season: number, episode: number): Promise<IEpisode[]>{
        return this._http.get(`/api/episodes/${serial_id}/${season}/${episode}/`)
            .toPromise()
            .then(res => res.json() || []);
    }

    getEpisodesBrieflyByOriginalName(serial_orig_name: string):Promise<IEpisode[]>{
        return this._http.get(`/api/episodes?serial_name=${serial_orig_name}&briefly=true`)
            .toPromise()
            .then(res => res.json() || []);
    }
}