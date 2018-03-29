import { subscribeOn } from 'rxjs/operators/subscribeOn';
import { GoaKingService } from '../services/goaking.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'dashboard',
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    user: any;
    dataLoading: boolean = false;
    brokenNetwork = false;

    constructor(private _eCRMFSService: GoaKingService) {
    }

    ngOnInit() {
        //this.getUsers();
    }
}