import {Component, HostListener, OnInit} from "@angular/core";
import {MdlDialogReference} from "angular2-mdl";
import {UserService} from "./user.service";
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";
import {IUser} from "./user";

@Component({
    selector: 'login-dialog',
    templateUrl: './app/user/login-dialog.component.html',
    styleUrls:['./app/user/login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit{
    public form: FormGroup;
    public email = new FormControl('',  Validators.required);
    public password = new FormControl('', Validators.required);
    public user: IUser = null;

    public credentialsCorrect: boolean = true;

    constructor(private dialog: MdlDialogReference,
                private _formBuilder: FormBuilder,
                private _userService: UserService) { }

    public login() {
        this._userService.login(this.email.value, this.password.value)
            .then(user => {
                this._userService.user = user;
                this.dialog.hide();
            })
            .catch(err => {
                this.credentialsCorrect = false;
            } );
    }

    @HostListener('keydown.esc')
    public onEsc(): void {
        this.dialog.hide();
    }

    ngOnInit():void{
        this.form = this._formBuilder.group({
            'email':  this.email,
            'password':   this.password
        });
    }
}