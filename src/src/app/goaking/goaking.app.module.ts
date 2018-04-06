import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';

// material design imports
import { ElishCustomMaterialModule } from './shared/elish.material.module';
//import 'hammerjs';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, MissingTranslationHandler } from 'ng2-translate';

import { APP_ROUTES } from './shared/routes';
import { AppComponent } from './app.component';
import { AboutusComponent } from './dashboard/aboutus.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from './shared/footer.component';
import { HeaderComponent } from './shared/header.component';
import { MyMissingTranslationHandler } from './shared/missingtemplate.component';
import { NotFoundComponent } from './shared/not-found.component';

// replace with new firebase services
import { GoaKingService } from './services/goaking.service';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    NotFoundComponent,
    AboutusComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    ElishCustomMaterialModule,
    APP_ROUTES,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot()
  ],
  providers: [GoaKingService,
    { provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }