import { Component, OnInit } from '@angular/core';
import { eCRMFirestoreService } from '../services/ecrmfs.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  data;
  stopCondition = false;
  constructor(private _eCRMFSService: eCRMFirestoreService) {
  }

  ngOnInit() {
    this._eCRMFSService.getUserLocation();
    this.getUserPreferences();
  }

  private getUserPreferences() {
  Observable.interval(300000)
    .takeWhile(() => !this.stopCondition)
    .subscribe(i => { 
        this._eCRMFSService.getUserLocation();
        // This will be called every 300 seconds until `stopCondition` flag is set to true
    })
  }
}