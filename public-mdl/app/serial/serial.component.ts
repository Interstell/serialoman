import {Component, OnDestroy, OnInit} from "@angular/core";
import {ISerial} from "./serial";
import {ActivatedRoute, Router} from "@angular/router";
import {SerialService} from "./serial.service";
import {Subscription} from "rxjs";
import {EpisodeService} from "../episode/episode.service";
import {IEpisode} from "../episode/episode";
import {SubscriptionService} from "../subscription/subscription.service";
import {IWMSubscription} from "../subscription/subscription";
import {UserService} from "../user/user.service";
import {IUser} from "../user/user";
import {MdlSnackbarService} from "angular2-mdl";

@Component({
    templateUrl:'app/serial/serial.component.html',
    styleUrls:['app/serial/serial.component.css']
})
export class SerialComponent implements OnInit, OnDestroy{
    serial: ISerial;
    serialId: number = null;
    private sub: Subscription;
    descriptionBrief: string;
    plotBrief : string;

    lostfilmTranslates: Boolean = false;
    newstudioTranslates: Boolean = false;

    seasons: IEpisode[][];

    subscription : IWMSubscription;
    user: IUser;


    lostfilmSubscribed : Boolean;
    newstudioSubscribed: Boolean;
    emailNotified: Boolean;

    constructor(private _route: ActivatedRoute,
                private _router: Router,
                private _serialService: SerialService,
                private _episodeService: EpisodeService,
                private _userService : UserService,
                private _subscriptionService : SubscriptionService,
                private _mdlSnackbarService: MdlSnackbarService) {}

    fetchData():void{
        this._serialService.getSerialById(this.serialId)
            .then(serial =>{
                    this.serial = serial;
                    if (serial.description){
                        this.descriptionBrief = this.serial.description.slice(0, 100).trim() + '...';
                        this.plotBrief = this.serial.description.slice(0, 200).trim() + '...'
                    }
                    this.seasons = Array(this.serial.seasons_num).fill([]);
                    this.user = this._userService.user;
                    this._episodeService.getEpisodesBrieflyByOriginalName(this.serial.orig_name)
                        .then(episodes => {
                            episodes.forEach(episode => {
                                if (episode.source == 'newstudio')
                                    this.newstudioTranslates = true;
                                if (episode.source == 'lostfilm')
                                    this.lostfilmTranslates = true;
                            });
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
                            this.fetchSubscriptionData();
                        });
                });
    }

    fetchSubscriptionData(){
        this._subscriptionService.getSubscriptions()
            .then(subscriptions => {
                this.subscription = subscriptions.find(sub => sub.serial_orig_name == this.serial.orig_name);
                if (!this.subscription)
                    return this.subscription = null;
                let ns = this.subscription.episode_sources.find(sc => sc == 'newstudio');
                if (ns)
                    this.newstudioSubscribed = true;
                let lf = this.subscription.episode_sources.find(lf => lf == 'lostfilm');
                if (lf)
                    this.lostfilmSubscribed = true;
            });
    }

    subscribeForSerial(){
        let sources = [];
        if (this.lostfilmTranslates)
            sources.push('lostfilm');
        if (this.newstudioTranslates)
            sources.push('newstudio');
        this._subscriptionService.addSubscription({
            serial_orig_name: this.serial.orig_name,
            episode_sources : sources,
            notification_methods : ['email']
        }).then(subscription => {
            this.subscription = subscription;
            this._mdlSnackbarService.showSnackbar({
                message:'Вы успешно подписались на выход новых серий.'
            });
            this.fetchSubscriptionData();
        })
    }

    unsubcribeOfSerial(){
        this._subscriptionService.deleteSubscription(this.subscription)
            .then(subscription => {
                this.subscription = null;
                this._mdlSnackbarService.showSnackbar({
                    message:'Вы успешно отписались.'
                });
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

    saveSubscription(){
        let sourceArr = [];
        if (this.lostfilmSubscribed)
            sourceArr.push('lostfilm');
        if (this.newstudioSubscribed)
            sourceArr.push('newstudio');
        this.subscription.episode_sources = sourceArr;
        this._subscriptionService.updateSubscription(this.subscription)
            .then((subscription) => {
                this.subscription = subscription;
                this._mdlSnackbarService.showSnackbar({
                    message:'Изменения в подписке сохранены.'
                });
            })
            .catch(() => {
                this._mdlSnackbarService.showSnackbar({
                    message:'Внутренняя ошибка сервера.'
                });
            })
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
}