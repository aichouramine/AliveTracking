import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { moveIn, fallIn } from '../shared/router.animations';
import { eLabService } from '../services/elab.service';

@Component({
  selector: 'email',
  templateUrl: 'email.component.html',
  animations: [moveIn(), fallIn()],
  host: { '[@moveIn]': '' }
})

export class EmailComponent implements OnInit {
  state: string = '';
  error: any;
  dataLoading: boolean = false;
  brokenNetwork = false;

  constructor(private afAuth: AngularFireAuth, private router: Router, private _eLabService: eLabService) {
  }

  ngOnInit() {
  }

  onSubmit(formData) {

    if (formData.valid) {
      this.dataLoading = true;
      this.afAuth.auth.signInWithEmailAndPassword(formData.value.email, formData.value.password).then(
        (success) => {
          this._eLabService.setUserAuth(
          this.afAuth.auth.currentUser.uid,
          this.afAuth.auth.currentUser.displayName,
          this.afAuth.auth.currentUser.phoneNumber,
           this.afAuth.auth.currentUser.email,
           this.afAuth.auth.currentUser.photoURL
        );
          this.router.navigate(['/members']);
        }
      ).catch(
        (error: firebase.FirebaseError) => {
          this.error = error.message;
          this.dataLoading = false;
        }
        )
    }
  }
}