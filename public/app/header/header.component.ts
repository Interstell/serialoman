import {Component, OnInit, AfterViewInit} from "@angular/core";
import {SerialService} from "../serial/serial.service";
import {ISerial} from "../serial/serial";
declare const $: any;

@Component({
    selector:'sm-header',
    templateUrl: './app/header/header.component.html',
    styleUrls:['./app/header/header.component.css']
})
export class HeaderComponent implements AfterViewInit, OnInit{
    pageTitle: string = 'Serialoman';
    briefSerials : ISerial[];

    constructor(private _serialService: SerialService){}

    ngOnInit():void{
        this._serialService.getSerialsBriefly()
            .subscribe(
                serials => this.briefSerials = serials,
                error => console.error(<any>error)
            )
    }

    ngAfterViewInit():void {
        $('.button-collapse').sideNav({
                menuWidth: 300
        });
        $('.collapsible').collapsible();
    }
}
