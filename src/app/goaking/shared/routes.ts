import { Router, RouterModule } from '@angular/router';
import { AboutusComponent } from '../dashboard/aboutus.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { NotFoundComponent } from '../shared/not-found.component';

export const APP_ROUTES = RouterModule.forRoot([
    { path: '', redirectTo: '/aboutus', pathMatch: 'full' },
    { path: 'aboutus', component: AboutusComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: '**', redirectTo: '/aboutus', pathMatch: 'full' }
]);