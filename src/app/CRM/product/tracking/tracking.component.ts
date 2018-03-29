import { Component, OnInit,ViewChild, AfterViewInit } from '@angular/core';
import { eCRMFirestoreService } from '../../services/ecrmfs.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'tracking',
    templateUrl: 'tracking.component.html'
})
export class TrackingComponent implements OnInit, AfterViewInit {
    lat: number;
    lng: number;
    data: any;
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    private displayedColumns = ['useremail','createdAt','id'];
    members;
    toggleField: string;
    mylat: string;
    mylong: string;

    constructor(private _eCRMFSService: eCRMFirestoreService, public snackBar: MatSnackBar) {
    }

    ngOnInit() {
        this.getUserLocation();
        this.dataSource = new MatTableDataSource(this.members);
//        this.getHistLocation(); // call this only when tab is clicked
        this.toggleField = "myLocMode";
    }

    private getUserLocation() {
        //this.data = this._eCRMFSService.getUserLocation();
        this.lat = this._eCRMFSService.lat;
        this.lng = this._eCRMFSService.lng;
    }

    onLinkClick(event) {
        if (event.index == "1") {
            this.getHistLocation();
        }
    }
    
    getHistLocation() {
        this._eCRMFSService.getLocations('location')
            .subscribe(members => {
                this.dataSource = new MatTableDataSource(members);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            });
    }

    showLocation(lat,long) {
        //console.log(lat)
        this.toggle('myLocShowMode');
        this.toggleField = "";
        this.mylat = lat;
        this.mylong = long;
    }

    toggle(filter?) {
        if (!filter) { filter = "myLocMode" }
        else { filter = filter; }
        this.toggleField = filter;
    }
    //mat table paginator and filter functions
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    openSnackBar(message: string, action: string) {
    message = "For more history, please upgrade to Pro membership. email: info@elishconsulting.com ph# +91-7007518790";
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}