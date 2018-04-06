import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class BackendService {
    private _backendUrl = "http://elisheducation.com/APP/LLBAPI/";

	constructor(private _http: Http) {
	}

	createAuthorizationHeader(headers: Headers, keys) {
		headers.append('Authorization', 'Basic ' +
			btoa(keys));
	}

    createUser(userData) {
		let headers = new Headers();
        let _url = this._backendUrl + "operator.php?action=n";
		console.log(_url);
		return this._http.post(_url, JSON.stringify(userData), { headers: headers })
			.map(res => res.json());
	}
    loginFn(userData) {
		let headers = new Headers();
        let _url = this._backendUrl + "operator.php?action=v";
		return this._http.post(_url, JSON.stringify(userData), { headers: headers })
			.map(res => res.json());
	}
}