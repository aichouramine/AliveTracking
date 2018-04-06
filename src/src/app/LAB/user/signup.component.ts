import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { moveIn, fallIn } from '../shared/router.animations';

@Component({
  selector: 'signup',
  templateUrl: 'signup.component.html',
  animations: [moveIn(), fallIn()],
  host: { '[@moveIn]': '' }
})
export class SignupComponent {

  state: string = '';
  error: any;
  dataLoading: boolean = false;
  brokenNetwork = false;
  savedChanges = false;

  constructor(public afAuth: AngularFireAuth, private router: Router) {
  }

  routeLoginPage (){
    this.router.navigate(['/members']);
  }

  onSubmit(formData) {
    if (formData.valid) {
      this.dataLoading = true;
      //console.log(formData.value);
      this.afAuth.auth.createUserWithEmailAndPassword(formData.value.email, formData.value.password)
      .then(
        (success) => {
          //console.log(success);
        this.savedChanges = true;      
        }
      )
      .catch(
        (error: firebase.FirebaseError) => {
          this.error = error.message;
          this.dataLoading = false;
        }
        )
    }
  }
}