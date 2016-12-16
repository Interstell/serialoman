import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import {MainComponent} from "./main/main.component";
import {MdlModule} from "angular2-mdl";
import {UserService} from "./user/user.service";
import {LoginDialogComponent} from "./user/login-dialog.component";
import {SerialComponent} from "./serial/serial.component";
import {SerialService} from "./serial/serial.service";
import {SerialsListComponent} from "./serials-list/serials-list.component";

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        MdlModule,
        RouterModule.forRoot([
            {path:'serials', component: SerialsListComponent},
            {path:'serials/page/:page', component: SerialsListComponent},
            {path:'serials/:name', component: SerialComponent},
            {path:'', component: MainComponent, pathMatch: 'full'},
            {path:'**', redirectTo:'', pathMatch: 'full'}
        ])
    ],
    declarations: [
        AppComponent,
        MainComponent,
        LoginDialogComponent,
        SerialComponent,
        SerialsListComponent
    ],
    entryComponents: [LoginDialogComponent],
    providers: [
        UserService,
        SerialService
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
