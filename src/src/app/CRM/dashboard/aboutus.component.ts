import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { trigger, state, style, animate, transition, group
} from '@angular/animations';

@Component({
  selector: 'aboutus',
  templateUrl: 'aboutus.component.html'
})
export class AboutusComponent {
  emailSent = false;
heroes = ['Test 1','Test 2'];

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