import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Component({
  selector: 'aboutus',
  templateUrl: 'aboutus.component.html'
})
export class AboutusComponent {
  emailSent = false;

  constructor(private http: Http) { }

  onSubmit(filter) {
    var headers = new Headers();
    var message = 'name=' + JSON.stringify(filter);

    headers.append('Content-Type', 'application/X-www-form-urlencoded');
    this.http.post('http://elisheducation.com/contact-form-app.php', message, { headers: headers }).subscribe((data) => {
      this.emailSent = true;
    })
  }
}