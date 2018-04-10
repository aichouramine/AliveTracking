import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { moveIn, fallIn, moveInLeft } from '../shared/router.animations';
import { eCRMFirestoreService } from '../services/ecrmfs.service';
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
  savedChanges = false;
  dataLoading: boolean = false;
  brokenNetwork = false;
  error;
  data;
  portal: any;
  companycderror = false;
  portalcdreq = true;

  constructor(private afAuth: AngularFireAuth, private router: Router,private _eCRMFSService: eCRMFirestoreService) {
  }

  ngOnInit() {
    this.data = this._eCRMFSService.getUserPreferences().subscribe();
    this.userPref = this._eCRMFSService.userPreferences;
    this.data = this._eCRMFSService.getUserLocation();
  }

  setUser(formData) {
    this.portal = this._eCRMFSService.getPortal(formData.portal).subscribe(
      (res) => {
        if (res.length > 0) {
          window.localStorage.setItem("eCRMkeyA", res[0]['isAdmin']);
          window.localStorage.setItem("eCRMkeyC", res[0]['company']);
          window.localStorage.setItem("eCRMkeyN", formData.uname);
          window.localStorage.setItem("eCRMkeyE", this.afAuth.auth.currentUser.email);
          this.companycderror = false;
          this.savedChanges = true;
          return this._eCRMFSService.setUser(formData);
        } else {
          this.companycderror = true;
        }
      },
      error => {
      this.brokenNetwork = true;
        console.log("API didn't respond.");
      },
      () => {
        this.userPref = this._eCRMFSService.userPreferences;
      }
    )
  }

  logout() {
     this.afAuth.auth.signOut()
      .then(
        (success) => {
          window.localStorage.removeItem("eCRMkeyA");
          window.localStorage.removeItem("eCRMkeyC");
          window.localStorage.removeItem("eCRMkeyN");
          window.localStorage.removeItem("eCRMkeyE");
        //this._eCRMFSService.logout();
        this.router.navigate(['/aboutus']);
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