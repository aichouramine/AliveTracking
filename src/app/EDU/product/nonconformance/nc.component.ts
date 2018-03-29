import { eLabService } from '../../services/elab.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
//import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
    selector: 'non-conformance',
    templateUrl: 'nc.component.html'
})
export class NCComponent implements OnInit {
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
    
  ncDept = [
    {value: 'LAB', viewValue: 'LAB'},
    {value: 'RADIOLOGY', viewValue: 'RADIOLOGY'},
    {value: 'HR', viewValue: 'HR'},
    {value: 'MRI', viewValue: 'Others'},
    {value: 'MARKETTING', viewValue: 'MRI'},
    {value: 'COLLECTION BOY', viewValue: 'COLLECTION BOY'},
    {value: 'INTERNAL AUDIT', viewValue: 'INTERNAL AUDIT'},
    {value: 'COMPLAINT', viewValue: 'COMPLAINT'}
  ];
  ncWS = [
    {value: 'HISTOPATHOLGY', viewValue: 'HISTOPATHOLGY'},
    {value: 'CLINICAL PATH', viewValue: 'CLINICAL PATH'},
    {value: 'MICROBIOLOGY', viewValue: 'MICROBIOLOGY'},
    {value: 'CYTOLOGY', viewValue: 'CYTOLOGY'},
    {value: 'HAEMATOLOGY-01', viewValue: 'HAEMATOLOGY-01'},
    {value: 'MISCELLANEOUS', viewValue: 'MISCELLANEOUS'},
    {value: 'IMMUNOLOGY', viewValue: 'IMMUNOLOGY'},
    {value: 'BCH-311/411-MISPA', viewValue: 'BCH-311/411-MISPA'},
    {value: 'SEND OUT', viewValue: 'SEND OUT'},
    {value: 'MOLECULAR DIAG.', viewValue: 'MOLECULAR DIAG.'},
    {value: 'RADIOLOGY', viewValue: 'RADIOLOGY'},
    {value: 'STORE/PURCHASE', viewValue: 'STORE/PURCHASE'},
    {value: 'ULTRASOUND', viewValue: 'ULTRASOUND'},
    {value: 'X-RAY', viewValue: 'X-RAY'},
    {value: 'ECHOCARDIOGRAPHY', viewValue: 'ECHOCARDIOGRAPHY'},
    {value: 'MAMMOGRAPHY & OPG', viewValue: 'MAMMOGRAPHY & OPG'},
    {value: 'CT SCAN', viewValue: 'CT SCAN'},
    {value: 'MRI', viewValue: 'MRI'},
    {value: 'DEXA', viewValue: 'DEXA'},
    {value: 'BCH-6000', viewValue: 'BCH-6000'},
    {value: 'SEROLOGY', viewValue: 'SEROLOGY'},
    {value: 'SAMPLE COLLECTION', viewValue: 'SAMPLE COLLECTION'},
    {value: 'OPG', viewValue: 'OPG'},
    {value: 'BIOCHEMISTRY', viewValue: 'BIOCHEMISTRY'},
    {value: 'BONE MARROW', viewValue: 'BONE MARROW'},
    {value: 'DISPATCH-PATH', viewValue: 'DISPATCH-PATH'},
    {value: 'DISPATCH-RADIOLOGY', viewValue: 'DISPATCH-RADIOLOGY'},
    {value: 'COLLECTION BOY', viewValue: 'COLLECTION BOY'},
    {value: 'HAEMATOLOGY', viewValue: 'HAEMATOLOGY'},
    {value: 'BC6800/ ROLLER', viewValue: 'BC6800/ ROLLER'},
    {value: 'OBST ULTRASOUND', viewValue: 'OBST ULTRASOUND'},
    {value: 'IMMUNOHISTOCHEMISTRY', viewValue: 'IMMUNOHISTOCHEMISTRY'},
    {value: 'SEROLOGY-01', viewValue: 'SEROLOGY-01'},
    {value: 'CLINICAL PATH-01', viewValue: 'CLINICAL PATH-01'}
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
        this._eLabService.getCustomers('nonconformance')
            .subscribe(members => {
                this.members = members;
                //this.dataSource = new ListDataSource(members);
                this.dataSource = new MatTableDataSource(this.members);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            });
    }
    
    setData(data: any) {
        return this._eLabService.setCustomer('nonconformance',data);
    }

    getFilterData(filter) {
        this._eLabService.getFilterCustomers('nonconformance', filter)
            .subscribe(members => {
                this.members = members;
                this.dataSource = new MatTableDataSource(members);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            });
    }
    deleteCustomerDoc(docId) {
        if (confirm("Are you sure want to delete this record ?")) {
            this.myDocData = this._eLabService.deleteCustomerDoc('nonconformance', docId);
        }
    }
    getCustomerDoc(docId) {
        this.myCustID = docId;
        this.myDocData = this._eLabService.getCustomerDoc('nonconformance', docId);
        this.toggle('editMode');
    }

    updateCustomerDoc(docId, formData) {
        this.myDocData = this._eLabService.updateCustomerDoc('nonconformance', formData, docId);
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