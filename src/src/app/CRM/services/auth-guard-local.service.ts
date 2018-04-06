import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable()

export class AuthGuardLocal implements CanActivate {

    constructor(private _router: Router) {
    }

    canActivate() {
             if(localStorage.getItem('eCRMkeyC')) {
                return true;
             } else {
                this._router.navigate(['/members']);
                return false;
            }
    }
}