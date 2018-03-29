import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'hammerjs';
import { AppModule } from './app/CRM/shared/crm.app.module';
import { environment } from './app/CRM/shared/environment';

//import { AppModule } from './app/LAB/lab.app.module';
//import { environment } from './app/LAB/shared/environment';

//import { AppModule } from './app/EDU/edu.app.module';
//import { environment } from './app/EDU/shared/environment';

//import { AppModule } from './app/goaking/goaking.app.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
