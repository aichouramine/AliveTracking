import { Router, RouterModule } from '@angular/router';
import { AboutusComponent } from '../dashboard/aboutus.component';
import { AuthGuard } from '../services/auth-guard.service';
import { AuthGuardLocal } from '../services/auth-guard-local.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LoginComponent } from '../user/login.component';
import { EmailComponent } from '../user/email.component';
import { SignupComponent } from '../user/signup.component';
import { MembersComponent } from '../user/members.component';
import { CRMTabComponent } from '../product/CRMTab.component';
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
import { CRMPediaComponent } from '../product/crmpedia/crmpedia.component';
import { CurrentNewsComponent } from '../product/news/news.current.component';
import { NotFoundComponent } from '../shared/not-found.component';
import { HelpDeskComponent } from '../shared/helpdesk/helpdesk.component';

export const APP_ROUTES = RouterModule.forRoot([
    { path: '', redirectTo: '/aboutus', pathMatch: 'full' },
    { path: 'aboutus', component: AboutusComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'login', component: LoginComponent },
    { path: 'email', component: EmailComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'news', component: CurrentNewsComponent },
    { path: 'crmpedia', component: CRMPediaComponent },
    { path: 'members', component: MembersComponent, canActivate: [AuthGuard] },
    { path: 'crmtab', component: CRMTabComponent, canActivate: [AuthGuard,AuthGuardLocal] },
    { path: 'customer', component: CustomerComponent, canActivate: [AuthGuard,AuthGuardLocal] },
    { path: 'lead', component: LeadComponent, canActivate: [AuthGuard,AuthGuardLocal] },

    { path: 'sales', component: SalesComponent, canActivate: [AuthGuard,AuthGuardLocal] },
    { path: 'workorder', component: WorkOrderComponent, canActivate: [AuthGuard,AuthGuardLocal] },
    { path: 'calls', component: CallsComponent, canActivate: [AuthGuard,AuthGuardLocal] },
    { path: 'cemail', component: CEmailComponent, canActivate: [AuthGuard,AuthGuardLocal] },
    { path: 'enquiry', component: EnquiryComponent, canActivate: [AuthGuard,AuthGuardLocal] },
    { path: 'visit', component: VisitComponent, canActivate: [AuthGuard,AuthGuardLocal] },

    { path: 'tracking', component: TrackingComponent, canActivate: [AuthGuard,AuthGuardLocal] },
    { path: 'attendance', component: AttendanceComponent, canActivate: [AuthGuard,AuthGuardLocal] },
    { path: 'visitor', component: VisitorComponent, canActivate: [AuthGuard,AuthGuardLocal] },
    { path: 'guest', component: GuestComponent, canActivate: [AuthGuard,AuthGuardLocal] },
    { path: 'visitregister/:id', component: VisitorRegisterComponent, canActivate: [AuthGuard,AuthGuardLocal] },
    { path: 'host', component: HostComponent, canActivate: [AuthGuard,AuthGuardLocal] },
    { path: 'fileupload', component: FileUploadComponent, canActivate: [AuthGuard,AuthGuardLocal] },
    { path: 'helpdesk', component: HelpDeskComponent},
    //{ path: 'settings', component: SettingsComponent },
    //{ path: 'default', component: DefaultComponent, canActivate: [AuthGuard] },
    //{ path: 'visitor', component: VisitorComponent },
    //{ path: 'visitee', component: VisiteeComponent, canActivate: [AuthGuard] },
    //{ path: 'visitee', component: VisiteeComponent },
    //{ path: '**', component: NotFoundComponent }
    { path: '**', redirectTo: '/aboutus', pathMatch: 'full' }
]);