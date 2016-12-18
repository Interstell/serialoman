import {Component, OnInit} from '@angular/core';
import {IUser} from "./user/user";
import {UserService} from "./user/user.service";
import {MdlDialogService, MdlDialogReference} from "angular2-mdl";
import {LoginDialogComponent} from "./user/login-dialog.component";

@Component({
    selector: 'wm-app',
    templateUrl:'./app/app.component.html',
    styleUrls: ['./app/app.component.css']
})
export class AppComponent implements OnInit{
    user: IUser;

    constructor(private _userService: UserService, private _dialogService: MdlDialogService){}

    ngOnInit():void{
        this._userService.getUserInfo()
            .then(user => {
                this.user = user;
                this._userService.user = user;
            })
            .catch(err => {
                this.user = null;
                this._userService.user = null;
            });
    }

    public showLoginDialog() {
        let loginDialog = this._dialogService.showCustomDialog({
            component: LoginDialogComponent,
            isModal: true,
            styles: {'width': '350px'},
            clickOutsideToClose: true,
            enterTransitionDuration: 400,
            leaveTransitionDuration: 400
        });
        loginDialog.subscribe( (dialogReference: MdlDialogReference) => {
            dialogReference.onHide().subscribe(() => {
                this.user = this._userService.user;
            });
        });
    }

    public logout() {
        this._userService.logout()
            .then(response => {
                this.user = null;
                this._userService.user = null;
            })
    }
}
