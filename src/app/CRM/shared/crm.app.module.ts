import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

// Angular Fire 2
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from './environment';
import { AgmCoreModule } from '@agm/core';

// material design imports
import { ElishCustomMaterialModule } from './elish.material.module';
//import 'hammerjs';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
//import { TranslateModule, MissingTranslationHandler } from 'ng2-translate';
import { TranslateModule, TranslateLoader, MissingTranslationHandler } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { AppComponent } from './app.component';
import { APP_ROUTES } from './routes';
import { AboutusComponent } from '../dashboard/aboutus.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FooterComponent } from './footer.component';
import { HeaderComponent } from './header.component';
import { MyMissingTranslationHandler } from './missingtemplate.component';
import { NotFoundComponent } from './not-found.component';
import { LoginComponent } from '../user/login.component';
import { EmailComponent } from '../user/email.component';
import { SignupComponent } from '../user/signup.component';
import { MembersComponent } from '../user/members.component';

import { CurrentNewsComponent } from '../product/news/news.current.component';
import { CRMTabComponent } from '../product/CRMTab.component';
import { CRMPediaComponent } from '../product/crmpedia/crmpedia.component';
import { CustomerComponent } from '../product/customer/customer.component';
import { LeadComponent } from '../product/lead/lead.component';
import { SalesComponent } from '../product/sales/sales.component';
import { WorkOrderComponent } from '../product/workorder/workorder.component';
import { CallsComponent } from '../product/calls/calls.component';
import { CEmailComponent } from '../product/email/email.component';
import { EnquiryComponent } from '../product/enquiry/enquiry.component';
import { VisitComponent } from '../product/visit/visit.component';
import { TrackingComponent } from '../product/tracking/tracking.component';
import { AttendanceComponent } from '../product/attendance/attendance.component';
import { VisitorComponent } from '../product/visitor/visitor.component';
import { GuestComponent } from '../product/visitor/guest.component';
import { HostComponent } from '../product/visitor/host.component';
import { VisitorRegisterComponent } from '../product/visitor/visitregister.component';
import { FileUploadComponent } from '../shared/dropzone/fileupload.component';
import { DropZoneDirective } from '../shared/dropzone/dropzone.directive';
import { FileSizePipe } from '../shared/dropzone/filesize.pipe';
import { HelpDeskComponent } from '../shared/helpdesk/helpdesk.component';

// delete all 4 later this later
import { PaginationComponent } from './pagination.component';
import { UserService } from '../services/user.service';
import { BackendService } from '../services/backend.service';
import { AuthGuard } from '../services/auth-guard.service';
import { AuthGuardLocal } from '../services/auth-guard-local.service';

// replace with new firebase services
import { eCRMFirestoreService } from '../services/ecrmfs.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, "assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AboutusComponent,
    AppComponent,
    DashboardComponent,
    FooterComponent,
    HeaderComponent,
    NotFoundComponent,
    PaginationComponent,
    LoginComponent,
    EmailComponent,
    SignupComponent,
    MembersComponent,
    CurrentNewsComponent,
    CRMTabComponent,
    CRMPediaComponent,
    CustomerComponent,
    LeadComponent,
    SalesComponent,
    WorkOrderComponent,
    CallsComponent,
    CEmailComponent,
    EnquiryComponent,
    VisitComponent,
    TrackingComponent,
    AttendanceComponent,
    VisitorComponent,
    GuestComponent,
    HostComponent,
    VisitorRegisterComponent,
    FileUploadComponent,
    DropZoneDirective,
    FileSizePipe,
    HelpDeskComponent
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
    //TranslateModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AngularFireModule.initializeApp(environment.firebase, 'atrackin'), // imports firebase/app needed for everything
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsKey
    }),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFireStorageModule
  ],
  providers: [eCRMFirestoreService,
    UserService, BackendService, AuthGuard, AuthGuardLocal,
    { provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }