import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'CRMTab',
    templateUrl: 'CRMTab.component.html'
})
export class CRMTabComponent implements OnInit {
    user: any;
    dataLoading: boolean = false;
    brokenNetwork = false;

    ngOnInit() {

    }
}