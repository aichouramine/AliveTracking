import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';

// Angular Fire 2
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from './shared/environment';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
// material design imports
import { ElishCustomMaterialModule } from './shared/elish.material.module';
//import 'hammerjs';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, MissingTranslationHandler } from 'ng2-translate';

import { APP_ROUTES } from './shared/routes';
import { AboutusComponent } from './dashboard/aboutus.component';
import { CurrentNewsComponent } from './product/news/news.current.component';
import { LABTabComponent } from './product/LABTab.component';
import { ContactComponent } from './product/contact/contact.component';
import { PServiceComponent } from './product/pservices/pservice.component';
import { PBookComponent } from './product/pservices/pbook.component';
import { NCComponent } from './product/nonconformance/nc.component';
import { FooterComponent } from './shared/footer.component';
import { HeaderComponent } from './shared/header.component';
import { MyMissingTranslationHandler } from './shared/missingtemplate.component';
import { NotFoundComponent } from './shared/not-found.component';
import { LoginComponent } from './user/login.component';
import { EmailComponent } from './user/email.component';
import { SignupComponent } from './user/signup.component';
import { MembersComponent } from './user/members.component';

// replace with new firebase services
import { eLabService } from './services/elab.service';
import { AuthGuard } from './services/auth-guard.service';
import { AuthGuardLocal } from './services/auth-guard-local.service';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    NotFoundComponent,
    AboutusComponent,
    CurrentNewsComponent,
    LABTabComponent,
    ContactComponent,
    LoginComponent,
    EmailComponent,
    SignupComponent,
    MembersComponent,
    PServiceComponent,
    PBookComponent,
    NCComponent
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
    TranslateModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase, 'elab-cd570'), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule // imports firebase/auth, only needed for auth features
  ],
  providers: [eLabService,
    AuthGuard, AuthGuardLocal,
    { provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }