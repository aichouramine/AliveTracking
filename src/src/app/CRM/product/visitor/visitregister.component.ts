import { eCRMFirestoreService } from '../../services/ecrmfs.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'visitor-register',
    templateUrl: 'visitregister.component.html'
})
export class VisitorRegisterComponent implements OnInit {
    showHelp = false;
    myDocData: any;
    docId;
    currentDate;
    hostPicPath;
    guestHistPicPath;
    showHostSelfie = false;
    showHosthistory = false;
    showGuestSelfie = false;
    showGuestHistSelfie = false;
    guestDoc= ["","",""];
    savedDataflag = false;
    visitHistory;
    
    constructor(private _eCRMFSService: eCRMFirestoreService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.currentDate = new Date();
        this.docId = this.route.snapshot.paramMap.get('id');
        //this.docId = 'nP96mgMEf2lFn9GBmksW';
        this.getData(this.docId);
    }

    toggleHelp() {
        this.showHelp = this.showHelp == true ? false : true;
    }
    toggleHostPic() {
        this.showHostSelfie = this.showHostSelfie == true ? false : true;
    }
    toggleGuestPic() {
        this.showGuestSelfie = this.showGuestSelfie == true ? false : true;
    }
    toggleGuestHistPic(docId) {
        this.showGuestHistSelfie = this.showGuestHistSelfie == true ? false : true;
        this.guestHistPicPath = docId;
    }
    toggleHostHistory(docId) {
        this.showHosthistory = this.showHosthistory == true ? false : true;
        return this._eCRMFSService.getOneUserVisitHistory('visitregister', docId)
        .subscribe(res => { this.visitHistory = res;});
    }

    getData(docId) {
        this.myDocData = this._eCRMFSService.getCustomerDoc('host', docId);
    }

    onSubmit(formData: any) {
        this._eCRMFSService.setCustomer('visitregister',formData);
        this.savedDataflag = true;
    }

    handleGuestUpdated(docId) {
        this.guestDoc = docId;
    }
}
