// main entry point
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import {SharedService} from "./shared/shared.service";

platformBrowserDynamic().bootstrapModule(AppModule);
