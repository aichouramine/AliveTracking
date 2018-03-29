import { Router, RouterModule } from '@angular/router';
import { AuthGuard } from '../services/auth-guard.service';
import { AuthGuardLocal } from '../services/auth-guard-local.service';
import { NotFoundComponent } from '../shared/not-found.component';
import { AboutusComponent } from '../dashboard/aboutus.component';
import { CurrentNewsComponent } from '../product/news/news.current.component';
import { LABTabComponent } from '../product/LABTab.component';
import { ContactComponent } from '../product/contact/contact.component';
import { LoginComponent } from '../user/login.component';
import { EmailComponent } from '../user/email.component';
import { SignupComponent } from '../user/signup.component';
import { MembersComponent } from '../user/members.component';
import { PServiceComponent } from '../product/pservices/pservice.component';
import { PBookComponent } from '../product/pservices/pbook.component';
import { NCComponent } from '../product/nonconformance/nc.component';

export const APP_ROUTES = RouterModule.forRoot([
    { path: '', redirectTo: '/aboutus', pathMatch: 'full' },
    { path: 'aboutus', component: AboutusComponent },
    { path: 'news', component: CurrentNewsComponent },
    //{ path: 'LABTab', component: LABTabComponent , canActivate: [AuthGuard]},
    //{ path: 'contact', component: ContactComponent , canActivate: [AuthGuard]},
    { path: 'LABTab', component: LABTabComponent, canActivate: [AuthGuard, AuthGuardLocal] },
    { path: 'contact', component: ContactComponent, canActivate: [AuthGuard, AuthGuardLocal] },
    { path: 'pservice', component: PServiceComponent, canActivate: [AuthGuard, AuthGuardLocal] },
    { path: 'pbook', component: PBookComponent, canActivate: [AuthGuard, AuthGuardLocal] },
    { path: 'nonconformance', component: NCComponent, canActivate: [AuthGuard, AuthGuardLocal] },
    { path: 'login', component: LoginComponent },
    { path: 'email', component: EmailComponent,canActivate: [AuthGuard, AuthGuardLocal] },
    { path: 'signup', component: SignupComponent },
    { path: 'members', component: MembersComponent, canActivate: [AuthGuard] },
    //{ path: 'settings', component: SettingsComponent },
    //{ path: 'default', component: DefaultComponent, canActivate: [AuthGuard] },
    //{ path: 'visitor', component: VisitorComponent },
    //{ path: 'visitee', component: VisiteeComponent, canActivate: [AuthGuard] },
    //{ path: 'visitee', component: VisiteeComponent },
    //{ path: '**', component: NotFoundComponent }
    { path: '**', redirectTo: '/aboutus', pathMatch: 'full' }
]);