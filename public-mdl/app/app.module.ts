import { NgModule } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import {MainComponent} from "./main/main.component";
import {MdlModule} from "angular2-mdl";
import {UserService} from "./user/user.service";

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        MdlModule,
        RouterModule.forRoot([
            {path:'', component: MainComponent, pathMatch: 'full'},
            {path:'**', redirectTo:'', pathMatch: 'full'}
        ])
    ],
    declarations: [
        AppComponent,
        MainComponent
    ],
    providers: [
        UserService
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
