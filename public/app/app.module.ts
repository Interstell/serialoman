import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import {HeaderComponent} from "./header/header.component";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {SerialService} from "./serial/serial.service";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule
    ],
    declarations: [
        AppComponent,
        HeaderComponent
    ],
    providers: [
        SerialService
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
