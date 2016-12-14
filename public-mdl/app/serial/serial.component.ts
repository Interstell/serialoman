import {Component} from "@angular/core";
import {ISerial} from "./serial";
import {ActivatedRoute} from "@angular/router";
import {SerialService} from "./serial.service";

@Component({
    templateUrl:'app/serial/serial.component.html',
    styleUrls:['app/serial/serial.component.css']
})
export class SerialComponent {
    serial: ISerial;
    serialId: number = null;
    private sub: any;

    constructor(private _route: ActivatedRoute,
                private _serialService: SerialService) {}

    fetchData():void{
        this._serialService.getSerialById(this.serialId)
            .then(serial =>{
                    this.serial = serial;
                });
    }

    ngOnInit():void{
        this.sub = this._route.params.subscribe(params => {
            this.serialId = +params['name'].match(/([\d]+)-/)[1];
            this.fetchData();
        });
    }
}