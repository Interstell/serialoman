

import {Component} from "@angular/core";
import {UserService} from "../user/user.service";
import {Router} from "@angular/router";
@Component({
    templateUrl:'app/register/register.component.html'
})
export class RegisterComponent{
    userInput = {};

    constructor(private _userService: UserService, private _router:Router){}

    onRegisterSubmit():void{
        this._userService.register(this.userInput)
            .subscribe(
                user => {
                    console.log(user);
                    this._router.navigate(['/']);
                }
            )
    };
}