import { Component } from '@angular/core';
import { eCRMFirestoreService } from '../../services/ecrmfs.service';

@Component({
  selector: 'crmpedia',
  templateUrl: 'crmpedia.component.html'
})
export class CRMPediaComponent {

  brokenNetwork;
  catalogueLoading = false;

  catalogues : any;
  currentCatalogue;

  constructor(private _eCRMFSService: eCRMFirestoreService) {
  }

  ngOnInit() {
    //this.getWiki('CRM');
  }
  private getWiki(term: string) {
    this.catalogueLoading = true;
    this._eCRMFSService.getWiki(term)
      .subscribe(
      res => {
        console.log(res);
        //this.catalogues = res['articles'];
      },
      error => {
        console.log("API didn't respond.");
        this.brokenNetwork = true;
        this.catalogueLoading = false;
      },
      () => {
      this.catalogueLoading = false;
      });
  }
}