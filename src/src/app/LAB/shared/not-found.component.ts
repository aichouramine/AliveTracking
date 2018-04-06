import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <header pageTitle="{{ 'btnaskus' | translate }}" imageUrl="home"></header>
  <p></p><p>{{ 'msgpagenotavailable' | translate }}</p>
  <a [routerLink]="['/aboutus']"><button md-raised-button>{{'btnhome' | translate}}</button></a>`
})
export class NotFoundComponent {
}