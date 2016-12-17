import {Component, OnInit, OnDestroy} from "@angular/core";
import {EpisodeService} from "./episode.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {IEpisode} from "./episode";
@Component({
    templateUrl:'app/episode/episode.component.html',
    styleUrls:['app/episode/episode.component.css']
})
export class EpisodeComponent implements OnInit, OnDestroy{
    private serial_id: number;
    private season: number;
    private episode_number: number;
    private sub : Subscription;

    episode : IEpisode;
    all_episodes: IEpisode[];

    constructor(private _route: ActivatedRoute,
                private _router: Router,
                private _episodeService: EpisodeService){}

    fetchData(){
        this._episodeService.getEpisodesWithStrictParams(this.serial_id, this.season, this.episode_number)
            .then(episodes => {
                if (episodes.length == 0){
                    return this._router.navigate(['/'])
                }
                this.all_episodes = episodes;
                this.episode = episodes[0];
                if (episodes.length > 1){
                    let lfEpisodes = episodes.filter(episode => episode.source == 'lostfilm');
                    if (lfEpisodes.length){
                        this.episode = lfEpisodes[0];
                    }
                }
            })
    }

    goToSerial(){
        this._router.navigate(['/serials/'+this.serial_id+'-'+this.episode.serial_orig_name.toLowerCase().replace(/[ &:]/g,'-')]);
    }

    ngOnInit(){
        this.sub = this._route.params.subscribe(params => {
            this.serial_id = +params['serial_id'];
            this.season = +params['season'];
            this.episode_number = +params['episode'];
            this.fetchData();
        });
    }

    ngOnDestroy(){
        this.sub.unsubscribe();
    }
}