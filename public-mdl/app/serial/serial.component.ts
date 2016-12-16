import {Component, OnDestroy, OnInit} from "@angular/core";
import {ISerial} from "./serial";
import {ActivatedRoute} from "@angular/router";
import {SerialService} from "./serial.service";
import {Subscription} from "rxjs";

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

    constructor(private _route: ActivatedRoute,
                private _serialService: SerialService) {}

    fetchData():void{
        this._serialService.getSerialById(this.serialId)
            .then(serial =>{
                    this.serial = serial;
                    if (serial.description){
                        this.descriptionBrief = this.serial.description.slice(0, 100).trim() + '...';
                        this.plotBrief = this.serial.description.slice(0, 200).trim() + '...'
                    }
                });
    }

    showFullDescription():void{
        this.descriptionBrief = this.serial.description;
    }

    showFullPlot(){
        this.plotBrief = this.serial.plot;
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