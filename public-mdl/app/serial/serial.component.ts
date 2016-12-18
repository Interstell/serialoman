import {Component, OnDestroy, OnInit, AfterViewChecked} from "@angular/core";
import {ISerial} from "./serial";
import {ActivatedRoute, Router} from "@angular/router";
import {SerialService} from "./serial.service";
import {Subscription} from "rxjs";
import {EpisodeService} from "../episode/episode.service";
import {IEpisode} from "../episode/episode";

@Component({
    templateUrl:'app/serial/serial.component.html',
    styleUrls:['app/serial/serial.component.css']
})
export class SerialComponent implements OnInit, OnDestroy, AfterViewChecked{
    serial: ISerial;
    serialId: number = null;
    private sub: Subscription;
    descriptionBrief: string;
    plotBrief : string;
    seasons: IEpisode[][];
    activeSeasonTab: number = 1;

    constructor(private _route: ActivatedRoute,
                private _router: Router,
                private _serialService: SerialService,
                private _episodeService: EpisodeService) {}

    fetchData():void{
        this._serialService.getSerialById(this.serialId)
            .then(serial =>{
                    this.serial = serial;
                    if (serial.description){
                        this.descriptionBrief = this.serial.description.slice(0, 100).trim() + '...';
                        this.plotBrief = this.serial.description.slice(0, 200).trim() + '...'
                    }
                    this.seasons = Array(this.serial.seasons_num).fill([]);
                    this._episodeService.getEpisodesBrieflyByOriginalName(this.serial.orig_name)
                        .then(episodes => {
                            for (let i = 0; i < episodes.length - 1; i++){
                                loop2:
                                for (let j = i + 1; j < episodes.length; j++){
                                    if (episodes[i].episode_number === episodes[j].episode_number
                                        && episodes[j].season === episodes[j].season
                                        && episodes[i].source !== episodes[j].source){
                                        episodes[i] = null;
                                        i++;
                                        continue loop2;
                                    }
                                }
                            }
                            episodes = episodes.filter(episode => episode);
                            for (let i = 0; i < this.serial.seasons_num; i++){
                                this.seasons[i] = episodes.filter(episode => episode.season == i + 1);
                                this.seasons[i].sort((a, b) => a.episode_number - b.episode_number);
                            }
                        })
                });
    }

    showFullDescription():void{
        this.descriptionBrief = this.serial.description;
    }

    showFullPlot(){
        this.plotBrief = this.serial.plot;
    }

    goToEpisode(episode : IEpisode){
        this._router.navigate([`/episodes/${this.serialId}/${episode.season}/${episode.episode_number}`])
    }

    ngOnInit():void{
        this.sub = this._route.params.subscribe(params => {
            this.serialId = +params['name'].match(/([\d]+)-/)[1];
            this.fetchData();
        });
    }

    ngOnDestroy(){
        this.sub.unsubscribe();
    }

    ngAfterViewChecked(){
        this.activeSeasonTab = 0;
    }
}