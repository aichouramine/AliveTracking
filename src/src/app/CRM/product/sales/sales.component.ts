import { eCRMFirestoreService } from '../../services/ecrmfs.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from "@angular/forms";
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
    selector: 'sales',
    templateUrl: 'sales.component.html'
})
export class SalesComponent implements OnInit {
    currentDate;
    currentDate7;
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
    customerForm: FormGroup;
    contents: FormArray;
    custDataFields = ['Customer Name', 'Item 1','Item 2','Item 3','Item 4','Item 5', 'Item 6','Item 7','Item 8','Item 9','Item 10', 'Total','Whatsapp', 'Phone 1', 'Phone 2', 'EMAIL', 'Facebook ID'];
    // list mode
    members: any[];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    private displayedColumns = ['customerid', 'name', 'phone', 'key'];

    constructor(private _fb: FormBuilder, private _eCRMFSService: eCRMFirestoreService) {
        this.customerForm = this._fb.group({
            customerid: ["", Validators.required],
            name: ["", Validators.required],
            phone: ["", [Validators.required, Validators.minLength(10)]],
            comments: [""],
            contents: this.buildArray()
        });
    }

    ngOnInit() {
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
        this._eCRMFSService.getCustomers('sales')
            .subscribe(members => {
                this.members = members;
                //this.dataSource = new ListDataSource(members);
                this.dataSource = new MatTableDataSource(members);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            });
    }
    getFilterData(filter) {
        this._eCRMFSService.getFilterCustomers('sales', filter)
            .subscribe(members => {
                this.members = members;
                this.dataSource = new MatTableDataSource(members);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            });
    }

    setData(data: any) {
        return this._eCRMFSService.setCustomer('sales',data);
    }

    // form methods
    buildArray(): FormArray {
        this.contents = this._fb.array([
            this.buildGroup()
        ]);
        return this.contents;
    }

    buildGroup(): FormGroup {
        return this._fb.group({
            key: [""],
            value: [""]
        });
    }

    buildAllGroup(key): FormGroup {
        return this._fb.group({
            key: [key],
            value: [""]
        });
    }

    addRow() {
        this.contents.push(this.buildGroup());
    }

    deleteRow(itemindex) {
        this.contents.removeAt(itemindex);
    }
    showAll() {
        for (var i = 0; i <= 2100; i++) {
            this.contents.removeAt(0);
        }
        for (var i = 0; i <= this.custDataFields.length; i++) {
            this.contents.push(this.buildAllGroup(this.custDataFields[i]));
        }
    }
    // edit mode
    showAll_edit() {
        for (var i = 0; i <= 2100; i++) {
            this.contents.removeAt(0);
        }
        for (var i = 0; i <= this.custDataFields.length; i++) {
            this.contents.push(this.buildAllGroup(this.custDataFields[i]));
        }
    }
    getCustomerDoc(docId) {
        this.myCustID = docId;
        this.myDocData = this._eCRMFSService.getCustomerDoc('sales', docId);
        this.customerForm.reset();
        this.toggle('editMode');
    }
    deleteCustomerDoc(docId) {
        if (confirm("Are you sure want to delete this record ?")) {
            this.myDocData = this._eCRMFSService.deleteCustomerDoc('sales', docId);
        }
    }
    updateCustomerDoc(docId, formData) {
        this.myDocData = this._eCRMFSService.updateCustomerDoc('sales', formData, docId);
        this.customerForm.reset();
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