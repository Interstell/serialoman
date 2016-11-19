import {Component, OnInit, OnDestroy, OnChanges, AfterViewInit, AfterViewChecked} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ISerial} from "./serial";
import {SerialService} from "./serial.service";
import {SharedService} from "../shared/shared.service";
import {serializePath} from "@angular/router/src/url_tree";

declare const $: any;

@Component({
    templateUrl:'app/serial/serial.component.html',
    styleUrls:['app/serial/serial.component.css']
})
export class SerialComponent implements OnInit, OnDestroy, AfterViewChecked{
    serial: ISerial;
    seasons: any[]; //mock
    jqueryRan: boolean = false;
    serialId: number = null;
    private sub: any;

    constructor(private _route: ActivatedRoute,
                private _sharedService: SharedService,
                private _serialService: SerialService) {}

    fetchData():void{
        this._serialService.getSerialById(this.serialId)
            .subscribe(
                serial =>{
                    this.serial = serial;
                    this.seasons = new Array(serial.seasons_num);
                    setTimeout(() => {
                        $('ul.tabs').tabs();
                    }, 0);
                },
                error => console.error(<any>error)
            );
    }

    ngOnInit():void{
        this.sub = this._route.params.subscribe(params => {
            this.serialId = +params['name'].match(/([\d]+)-/)[1];
            this.fetchData();
        });
    }

    ngAfterViewChecked():void {
        if (!this.jqueryRan && this.serial){
            this.jqueryRan = true;
            $('.collapsible').collapsible();

        }
    };

    ngOnDestroy():void{
        this.sub.unsubscribe();
    }



}