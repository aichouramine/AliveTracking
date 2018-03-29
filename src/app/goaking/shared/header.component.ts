import {Component, Input } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { Subscription } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'header',
  templateUrl: 'header.component.html'
})
export class HeaderComponent {
  @Input() imageUrl: string;
  @Input() pageTitle: string;
  emailSent = false;
  selectedValue;
  formShowing=false;
  private subscription_translate: Subscription;

  constructor(private http: Http, private _translate: TranslateService, private activatedRoute: ActivatedRoute) { 
    // translate code
    _translate.addLangs(['en','hi','bn','gj','kn','ml','ta','tl','ur']);
    _translate.setDefaultLang["en"];
    let browserLang = _translate.getBrowserLang();
    _translate.use(browserLang.match(/en|hi|bn/) ? browserLang : "en");
  }

  onSubmit(filter) {
    var headers = new Headers();
    var message = 'name=' + JSON.stringify(filter);

    headers.append('Content-Type', 'application/X-www-form-urlencoded');
    this.http.post('http://elisheducation.com/contact-form-app.php', message, { headers: headers }).subscribe((data) => {
      this.emailSent = true;
    });
  }

  changeLanguage(lang) {
    this._translate.use(lang);
  }

  ngOnInit() {
    // subscribe to router event
    this.subscription_translate = this.activatedRoute.queryParams.subscribe(
      (param: any) => {
        let locale = param['locale'];
        if (locale !== undefined) {
          this._translate.use(locale);
        }
      });
  }

  ngOnDestroy() {
    // prevent memory leak by unsubscribing
    this.subscription_translate.unsubscribe();
  }
}