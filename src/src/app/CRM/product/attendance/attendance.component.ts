import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { eCRMFirestoreService } from '../../services/ecrmfs.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'attendance',
    templateUrl: 'attendance.component.html'
})
export class AttendanceComponent implements OnInit, AfterViewInit {
    lat: number;
    lng: number;
    data: any;
    path: string;
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    private displayedColumns = ['useremail', 'createdAt', 'id','path'];
    members;
    toggleField: string;
    mylat: string;
    mylong: string;
    showCurrentLocation: boolean = false;
    myData;
    currentDate;
    attendanceSaved = false;

    constructor(private _eCRMFSService: eCRMFirestoreService, public snackBar: MatSnackBar) {
    }

    ngOnInit() {
        this.getUserLocation();
        this.dataSource = new MatTableDataSource(this.members);
        this.toggleField = "myLocMode";
        this.myData = this._eCRMFSService.getMemberType();
        this.currentDate = new Date();
    }

    onLinkClick(event) {
        if (event.index == "2") {
            this.getHistLocation();
        }
    }

    setAttendance() {
        this._eCRMFSService.setAttendance('NA', 'attendance');
        this.attendanceSaved = true;
    }

    private getUserLocation() {
        //this.data = this._eCRMFSService.getUserLocation();
        this.lat = this._eCRMFSService.lat;
        this.lng = this._eCRMFSService.lng;
    }

    getHistLocation() {
        this._eCRMFSService.getLocations('attendance')
            .subscribe(members => {
                this.dataSource = new MatTableDataSource(members);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            });
    }

    showLocation(lat, long) {
        //console.log(lat)
        this.toggle('myLocShowMode');
        this.toggleField = "";
        this.mylat = lat;
        this.mylong = long;
    }

    showPic(path){
        this.toggle('myPicMode');
        this.path = path;
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