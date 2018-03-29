import { eLabService } from '../../services/elab.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
//import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
    selector: 'contact',
    templateUrl: 'contact.component.html'
})
export class ContactComponent implements OnInit {
    currentDate;
    currentDate7;
    centerId;
    data: any;
    myDocData: any;
    myCustID: any;
    dataLoading: boolean = false;
    brokenNetwork = false;
    toggleField: string;
    // searchable properties
    name: string;
    phone: number;
    fromdt: Date;
    todt: Date;
    // list mode
    members: any;
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    private displayedColumns = ['regno', 'name', 'phone', 'key'];
    addType = [
    {value: 'FRN', viewValue: 'Franchises / PSC Key Account'},
    {value: 'RFD', viewValue: 'Referring Doctor'},
    {value: 'PNC', viewValue: 'Panel Company'},
    {value: 'PAT', viewValue: 'Patient'},
    {value: 'RFL', viewValue: 'Referring Laboratory'},
    {value: 'MKT', viewValue: 'Marketing Executive'},
    {value: 'CLB', viewValue: 'Collection Boys'},
    {value: 'FCL', viewValue: 'Facilitator'},
    {value: 'DIS', viewValue: 'Discount Authority'},
    {value: 'PRC', viewValue: 'Procedure Done By'},
    {value: 'EMP', viewValue: 'Employee'},
    {value: 'OTH', viewValue: 'Others'}
  ];
  selected= "FRN";
  sexType = [
    {value: 'M', viewValue: 'Male'},
    {value: 'F', viewValue: 'Female'},
    {value: 'N', viewValue: 'NA'},
    {value: 'O', viewValue: 'Others'}
  ];

    constructor(private _eLabService: eLabService) { }

    ngOnInit() {
        this.centerId = localStorage.getItem('eCRMkeyL');
        this.toggleField = "searchMode";
        this.currentDate = new Date();
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        this.currentDate7 = new Date();
        this.currentDate7.setDate(this.currentDate.getDate() - 7);
        this.dataSource = new MatTableDataSource(this.members);
    }

    toggle(filter?) {
        if (!filter) { filter = "searchMode" }
        else { filter = filter; }
        this.toggleField = filter;
    }

    getData() {
        this._eLabService.getCustomers('contact')
            .subscribe(members => {
                this.members = members;
                //this.dataSource = new ListDataSource(members);
                this.dataSource = new MatTableDataSource(this.members);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            });
    }
    
    setData(data: any) {
        return this._eLabService.setCustomer('contact',data);
    }

    getFilterData(filter) {
        this._eLabService.getFilterCustomers('contact', filter)
            .subscribe(members => {
                this.members = members;
                this.dataSource = new MatTableDataSource(members);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            });
    }
    deleteCustomerDoc(docId) {
        if (confirm("Are you sure want to delete this record ?")) {
            this.myDocData = this._eLabService.deleteCustomerDoc('contact', docId);
        }
    }
    getCustomerDoc(docId) {
        this.myCustID = docId;
        this.myDocData = this._eLabService.getCustomerDoc('contact', docId);
        this.toggle('editMode');
    }

    updateCustomerDoc(docId, formData) {
        this.myDocData = this._eLabService.updateCustomerDoc('contact', formData, docId);
        this.toggle('resMode');
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
}