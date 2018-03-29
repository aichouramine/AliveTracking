import { Component } from '@angular/core';
import { eCRMFirestoreService } from '../../services/ecrmfs.service';

@Component({
  selector: 'news',
  templateUrl: 'news.current.component.html'
})
export class CurrentNewsComponent {

  brokenNetwork;
  catalogueLoading = false;
  toggleField;
  toggleFinField;
  toggleTimeField;

  catalogues : any;
  finCatalogues: any;
  timeCatalogues: any;
  currentCatalogue;
  currentFinCatalogue;
  currentTimeCatalogue;

  constructor(private _userService: eCRMFirestoreService) {
  }

  ngOnInit() {
    this.loadNews();
    this.loadFinNews();
    this.loadTimeNews();
  }
  private loadNews() {
    this.catalogueLoading = true;
    this._userService.getNews('news')
      .subscribe(
      res => {
        //console.log(res);
        this.catalogues = res['articles'];
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
  private loadFinNews() {
    this.catalogueLoading = true;
    this._userService.getNews('fin')
      .subscribe(
      res => {
        this.finCatalogues = res['articles'];
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
  private loadTimeNews() {
    this.catalogueLoading = true;
    this._userService.getNews('times')
      .subscribe(
      res => {
        this.timeCatalogues = res['articles'];
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

  toggle(filter) {
    if (filter == "0")
    { this.toggleField = 0; }
    else { this.toggleField = filter; }
  }
  toggleFin(filter) {
    if (filter == "0")
    { this.toggleFinField = 0; }
    else { this.toggleFinField = filter; }
  }
  toggleTime(filter) {
    if (filter == "0")
    { this.toggleTimeField = 0; }
    else { this.toggleTimeField = filter; }
  }

  select(catalogue) {
    this.toggle(1); // MOBILE VERSION ONLY
    this.currentCatalogue = catalogue;
  }
  selectFin(catalogue) {
    this.toggleFin(1); // MOBILE VERSION ONLY
    this.currentFinCatalogue = catalogue;
  }
  selectTime(catalogue) {
    this.toggleTime(1); // MOBILE VERSION ONLY
    this.currentTimeCatalogue = catalogue;
  }
}