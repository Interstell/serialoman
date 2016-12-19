import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators, FormBuilder} from "@angular/forms";
import {UserService} from "../user/user.service";
import {Router} from "@angular/router";
import {MdlSnackbarService} from "angular2-mdl";
@Component({
    templateUrl:'app/register/register.component.html',
    styleUrls:['app/register/register.component.css']
})
export class RegisterComponent implements OnInit{

    public form: FormGroup;
    public email = new FormControl('',Validators.required);
    public password1 = new FormControl('', [Validators.required, Validators.minLength(1)]);
    public password2 = new FormControl('', [Validators.required, Validators.minLength(1)]);
    public username = new FormControl('',Validators.required);

    constructor(private fb: FormBuilder,
                private mdlSnackbarService: MdlSnackbarService,
                private _router: Router,
                private _userService: UserService) {
        this.form = fb.group({
            'email': this.email,
            'password1' : this.password1,
            'password2' : this.password2,
            'username' : this.username
        });
    }

    register(){
        this._userService.register({
            email: this.email.value,
            password1: this.password1.value,
            password2: this.password2.value,
            username: this.username.value
        })
            .then(() => {
                this.mdlSnackbarService.showSnackbar({
                    message:'Регистрация прошла успешно.',
                    action:{
                        handler:()=>{
                            this._router.navigate(['/']);
                        },
                        text: 'Войти'
                    }
                });
            })
            .catch((err) => {
                console.log(err);
                this.mdlSnackbarService.showSnackbar({
                    message: JSON.parse(err._body).error,
                });
            })
    }

    ngOnInit(){
        setTimeout(()=> {
            if (this._userService.user){
                this._router.navigate(['/']);
            }
        }, 0);
    }

}