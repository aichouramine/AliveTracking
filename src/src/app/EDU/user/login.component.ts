import { Component, OnInit, HostBinding } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { moveIn } from '../shared/router.animations';
import { eLabService } from '../services/elab.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  animations: [moveIn()],
  host: { '[@moveIn]': '' }
})

export class LoginComponent implements OnInit {
  error: any;
  user: Observable<any>;
  dataLoading: boolean = true;
  brokenNetwork = false;

  constructor(public afAuth: AngularFireAuth, private _router: Router, private _eLabService: eLabService) {
  }

  ngOnInit() {
    if (this.afAuth.authState) {
      this._router.navigateByUrl('/members');
    }
  }

  loginFb() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(
      (success) => {
        this._eLabService.setUserAuth(
          this.afAuth.auth.currentUser.uid,
          this.afAuth.auth.currentUser.displayName,
          this.afAuth.auth.currentUser.phoneNumber,
           this.afAuth.auth.currentUser.email,
           this.afAuth.auth.currentUser.photoURL
        );
        this._router.navigate(['/members']);
      }).catch(
      (err) => {
        this.error = err;
      })
  }

  loginGoogle() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
      (success) => {
        this._eLabService.setUserAuth(
          this.afAuth.auth.currentUser.uid,
          this.afAuth.auth.currentUser.displayName,
          this.afAuth.auth.currentUser.phoneNumber,
           this.afAuth.auth.currentUser.email,
           this.afAuth.auth.currentUser.photoURL
        );
        this._router.navigate(['/members']);
      }).catch(
      (err) => {
        this.error = err;
      })
  }
}