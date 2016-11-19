import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import {HeaderComponent} from "./header/header.component";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {SerialService} from "./serial/serial.service";
import {MainComponent} from "./main/main.component";
import {RouterModule} from "@angular/router";
import {SerialComponent} from "./serial/serial.component";
import {SharedService} from "./shared/shared.service";
import {UserService} from "./user/user.service";
import {RegisterComponent} from "./register/register.component";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot([
            {path:'register', component:RegisterComponent},
            {path:'serials/:name', component: SerialComponent},
            {path:'', component: MainComponent, pathMatch: 'full'},
            {path:'**', redirectTo:'', pathMatch: 'full'}
        ])
    ],
    declarations: [
        AppComponent,
        MainComponent,
        HeaderComponent,
        SerialComponent,
        RegisterComponent
    ],
    providers: [
        SerialService,
        SharedService,
        UserService
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
