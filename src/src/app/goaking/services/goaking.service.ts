import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GoaKingService {
    private _backendUrl = "http://goa-king.in/API/";

	constructor(private _http: Http) {
	}

	createAuthorizationHeader(headers: Headers, keys) {
		headers.append('Authorization', 'Basic ' +
			btoa(keys));
	}

    getData() {
		let headers = new Headers();
        let _url = this._backendUrl + "operator.php?action=g";
        return this._http.get(_url, { headers: headers })
            .map(res => res);
	}

    getCurrentNumber() {
		let headers = new Headers();
        let _url = this._backendUrl + "operator.php?action=c";
        return this._http.get(_url, { headers: headers })
            .map(res => res);
	}

	getAllNumbers(filter) {
		let headers = new Headers();
        let _url = this._backendUrl + "operator.php?action=a&recoverydt=" +filter;
        return this._http.get(_url, { headers: headers })
            .map(res => res);
	}
}