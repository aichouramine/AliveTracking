import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { GoaKingService } from '../services/goaking.service';

@Component({
  selector: 'aboutus',
  templateUrl: 'aboutus.component.html'
})
export class AboutusComponent implements OnInit {
  emailSent = false;
  dataDates: any;
  currentNumber;
  toggleField = true;
  allNumbers: any;

  constructor(private http: Http,private _eCRMFSService: GoaKingService) { }

  ngOnInit() {
    this._eCRMFSService.getData().subscribe(res => {
                this.dataDates = JSON.parse(res['_body'])['0']['data'];
                //console.log(this.dataDates)
            });
    this._eCRMFSService.getCurrentNumber().subscribe(res => {
                let x = JSON.parse(res['_body'])['0']['data']['0'];
                this.currentNumber = Object(x)
            });
  }

  getMonthNumbers(srchtxt) {
    console.log(srchtxt)
    this._eCRMFSService.getAllNumbers(srchtxt).subscribe(res => {
                let x = JSON.parse(res['_body'])['0']['data'];
                this.allNumbers = Object(x)
                console.log(Object(this.allNumbers))
            });
  }

  onSubmit(filter) {
    var headers = new Headers();
    var message = 'name=' + JSON.stringify(filter);

    headers.append('Content-Type', 'application/X-www-form-urlencoded');
    this.http.post('http://elisheducation.com/contact-form-app.php', message, { headers: headers }).subscribe((data) => {
      this.emailSent = true;
    })
  }
  color: string;

  availableColors = [
    { name: 'none', color: '' },
    { name: 'Primary', color: 'primary' },
    { name: 'Accent', color: 'accent' },
    { name: 'Warn', color: 'warn' }
  ];

  toggle(filter, srchtxt){
    if(filter) {
      if(filter == 'show') {
      this.toggleField = false;
      this.getMonthNumbers(srchtxt);
      } else {
        this.toggleField = true;
      }
    }
  }
}