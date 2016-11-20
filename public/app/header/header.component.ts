import {Component, OnInit, AfterViewInit} from "@angular/core";
import {SerialService} from "../serial/serial.service";
import {ISerial} from "../serial/serial";
import {SharedService} from "../shared/shared.service";
import {UserService} from "../user/user.service";
import {IUser} from "../user/user";
declare const $: any;

@Component({
    selector:'sm-header',
    templateUrl: './app/header/header.component.html',
    styleUrls:['./app/header/header.component.css']
})
export class HeaderComponent implements AfterViewInit, OnInit{
    pageTitle: string = 'Serialoman';
    briefSerials : ISerial[];
    popularSerials: ISerial[];
    archiveSerials: ISerial[];
    user: IUser;
    email: string;
    password: string;

    constructor(private _serialService: SerialService,
                private _userService: UserService,
                private _sharedService: SharedService){}

    getSerialUrl(serial : ISerial):string{
        return '/serials/'+serial.serial_id+'-'+serial.orig_name.toLowerCase().replace(/[ &]/g,'-');
    };

    onLoginSubmit():void{
        this._userService.login(this.email, this.password)
            .subscribe(
                response => {
                    this.user = response;
                    this.email='';
                    this.password='';
                }
            )
    }

    onLogout(): void{
        this._userService.logout()
            .subscribe(
                response => {
                    if (response.json().success){
                        this.user = null;
                    }
                }
            )
    }

    ngOnInit():void{
        this._serialService.getSerialsBriefly()
            .subscribe(
                serials => this.briefSerials = serials,
                error => console.error(<any>error)
            );
        this._serialService.getPopularSerials()
            .subscribe(
                serials => this.popularSerials = serials,
                error => console.error(<any>error)
            );
        this._serialService.getArchiveSerials()
            .subscribe(
                serials => this.archiveSerials = serials,
                error => console.error(<any>error)
            );
        this._userService.getUserInfo()
            .subscribe(
                value => {
                    if (!value.error)
                        this.user = value;
                },
                error => console.log(<any>error)
            )
    }

    ngAfterViewInit():void {
        $('.button-collapse').sideNav({
            menuWidth: 300
        });
        setTimeout(() => {
            $('.collapsible').collapsible();
        }, 250);
        $('.modal').modal();

    }
}
