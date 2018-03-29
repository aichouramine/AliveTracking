import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { moveIn, fallIn, moveInLeft } from '../shared/router.animations';
import { eLabService } from '../services/elab.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'members',
  templateUrl: 'members.component.html'
})

export class MembersComponent implements OnInit {
  userAuth: any;
  userPref: any
  name: string;
  photoUrl: string;
  currentDoc = '';
  state: string = '';
  currentDate;
  savedChanges = false;
  dataLoading: boolean = false;
  brokenNetwork = false;
  error;
  portal: any;
  companycderror = false;
  portalcdreq = true;

  constructor(private afAuth: AngularFireAuth, private router: Router, private _eLabService: eLabService) {
  }

  ngOnInit() {
    this.currentDate = new Date;
    if (this.afAuth.authState) {
      this.name = this.afAuth.auth.currentUser.displayName;
      this.photoUrl = this.afAuth.auth.currentUser.photoURL;
      this.getUser();
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  getUser(docId?) {
    let uid = localStorage.getItem('eCRMkeyI');
    this.userAuth = this._eLabService.getUserAuth();
    this.userPref = this._eLabService.getUser();
    this._eLabService.getUser().subscribe(
      (res) => {
        if (res) {
          this.portal = this._eLabService.getPortal(res['portal']).subscribe(
            (res) => {
              if (res) {
                //console.log(res)
                window.localStorage.setItem("eCRMkeyL", res['company']);
                this.companycderror = false;
              } else {
                this.companycderror = true;
                window.localStorage.removeItem("eCRMkeyL");
              }
            }
          );
        } else {
          this.portalcdreq = true;
        }
      }
    );
  }

  setUser(formData) {
    this.portal = this._eLabService.getPortal(formData.portal).subscribe(
      (res) => {
        if (res) {
          this.companycderror = false;
          this.savedChanges = true;
          return this._eLabService.setUser(formData);
        } else {
          this.companycderror = true;
          this._eLabService.deleteUser();
          window.localStorage.removeItem("eCRMkeyL");
        }
      }
    )
  }

  logout() {
    this.afAuth.auth.signOut()
      .then(
      (success) => {
        this._eLabService.logout();
        this.router.navigate(['/login']);
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
        } else {
          alert(errorMessage);
        }
        console.log(error);
      })
  }
}