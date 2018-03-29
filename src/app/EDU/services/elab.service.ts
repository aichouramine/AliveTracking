import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';

@Injectable()
export class eLabService {
    constructor(
        private afs: AngularFirestore,
        private _http: HttpClient
        //private _messageService: MessageService
    ) { }

    private _backendUrl = "http://elisheducation.com/APP/LLBAPI/";
    private _newsUrl = "https://newsapi.org/v1/articles?source=the-hindu&sortBy=top&apiKey=1fbee980d10644bca6e4c3243034c10a";
    private _timeNewsUrl = "https://newsapi.org/v2/top-headlines?sources=google-news-in&apiKey=1fbee980d10644bca6e4c3243034c10a";
    private _finNewsUrl = "https://newsapi.org/v2/top-headlines?sources=financial-times&apiKey=1fbee980d10644bca6e4c3243034c10a";
    //private _wikiUrl = 'https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=';
    private _url_keys = "";
    private _userAuthColl: string = "userauth";
    private _userColl: string = "userdb";
    private _compColl: string = "elabdb";
    private _compDoc: string = "PORTAL";
    private _custColl: string = "customer";
    private _contactColl: string = "contact";
    private _ncColl: string = "nonconformance";
    private _pserviceColl: string = "pservice";
    private _locColl: string = "location";
    private _leadColl: string = "lead";

    getPortal(docId?: string) {
        // fix this function to look into portal key instead of portal document
        let coll = this._compColl;
        return this.getDoc(coll, docId);
    }
    getUser(coll?: string, docId?: string) {
        if (!coll) { coll = this._userColl; }
        if (!docId) { docId = localStorage.getItem('eCRMkeyI'); }
        return this.getDoc(coll, docId);
    }
    deleteUser(coll?: string, docId?: string) {
        if (!coll) { coll = this._userColl; }
        if (!docId) { docId = localStorage.getItem('eCRMkeyI'); }
        return this.removeDoc(coll, docId);
    }
    setUser(formData: any, coll?: string, docId?: string) {
        if (!coll) { coll = this._userColl; }
        if (!docId) { docId = localStorage.getItem('eCRMkeyI'); }
        return this.setExistingDoc(coll, docId, formData);
    }

    getUserAuth(coll?: string, docId?: string) {
        if (!coll) { coll = this._userAuthColl; }
        if (!docId) { docId = localStorage.getItem('eCRMkeyI'); }
        return this.getDoc(coll, docId);
    }
    // this method is used when user logs in first time
    setUserAuth(uid, uname, phoneNumber, email, photoURL) {
        if (!localStorage.getItem('eCRMkeyI')) {
            window.localStorage.setItem("eCRMkeyI", uid);
            window.localStorage.setItem("eCRMkeyN", uname);
            window.localStorage.setItem("eCRMkeyP", phoneNumber);
            window.localStorage.setItem("eCRMkeyE", email);
            window.localStorage.setItem("eCRMkeyU", photoURL);
        }
        let data =
            {
                authuid: localStorage.getItem('eCRMkeyI'),
                authuname: localStorage.getItem('eCRMkeyN'),
                authphoneNumber: localStorage.getItem('eCRMkeyP'),
                authemail: localStorage.getItem('eCRMkeyE'),
                authphoto: localStorage.getItem('eCRMkeyU'),
            }
            ;
        this.setExistingDoc(this._userAuthColl, localStorage.getItem('eCRMkeyI'), data);
    }

    logout() {
        if (localStorage.getItem('eCRMkeyI')) {
            window.localStorage.removeItem("eCRMkeyI");
            window.localStorage.removeItem("eCRMkeyN");
            window.localStorage.removeItem("eCRMkeyP");
            window.localStorage.removeItem("eCRMkeyE");
            window.localStorage.removeItem("eCRMkeyU");
            window.localStorage.removeItem("eCRMkeyL");
        }
    }
    setCustomer(coll: string, formData: any, docId?: string) {
        if (coll == "contact") { coll = this._contactColl; }
        if (coll == "nonconformance") { coll = this._ncColl; }
        if (coll == "pservice") { coll = this._pserviceColl; }
        coll = this._compColl + "/" + localStorage.getItem('eCRMkeyL') + "/" + coll;
        return this.setNewDoc(coll, formData);
    }
    getCustomers(coll?: string, docId?: string, filters?: any) {
        if (coll == "contact") { coll = this._contactColl; }
        if (coll == "nonconformance") { coll = this._ncColl; }
        if (coll == "pservice") { coll = this._pserviceColl; }
        coll = this._compColl + "/" + localStorage.getItem('eCRMkeyL') + "/" + coll;
        //if (!docId) { docId = localStorage.getItem('eCRMkeyI'); }
        return this.getDocs(coll);
    }
    getFilterCustomers(coll: string, filters: any) {
        if (coll == "contact") {
            coll = this._contactColl;
            if (coll == "nonconformance") { coll = this._ncColl; }
        }
        if (coll == "pservice") { coll = this._pserviceColl; }
        coll = this._compColl + "/" + localStorage.getItem('eCRMkeyL') + "/" + coll;
        //if (!docId) { docId = localStorage.getItem('eCRMkeyI'); }
        return this.getDocs(coll, filters);
        //console.log(coll);
    }
    deleteCustomerDoc(coll: string, docId?: string, coll_userdb?: string, userId?: string) {
        if (coll == "contact") { coll = this._contactColl; }
        if (coll == "nonconformance") { coll = this._ncColl; }
        if (coll == "pservice") { coll = this._pserviceColl; }
        coll = this._compColl + "/" + localStorage.getItem('eCRMkeyL') + "/" + coll;
        let formData = { "delete_flag": "Y" }
        return this.deleteDoc(coll, docId);
    }
    getCustomerDoc(coll: string, docId?: string, coll_userdb?: string, userId?: string) {
        if (coll == "contact") { coll = this._contactColl; }
        if (coll == "nonconformance") { coll = this._ncColl; }
        if (coll == "pservice") { coll = this._pserviceColl; }
        coll = this._compColl + "/" + localStorage.getItem('eCRMkeyL') + "/" + coll;
        return this.getDoc(coll, docId);
    }
    updateCustomerDoc(coll: string, formData: any, docId?: string, coll_userdb?: string, userId?: string) {
        if (coll == "contact") { coll = this._contactColl; }
        if (coll == "nonconformance") { coll = this._ncColl; }
        if (coll == "pservice") { coll = this._pserviceColl; }
        coll = this._compColl + "/" + localStorage.getItem('eCRMkeyL') + "/" + coll;
        return this.updateDoc(coll, docId, formData);
    }
    // above functions are revised and below are copy paste from CRM
    // helper functions

    // get serverTimestamp
    get timestamp() {
        return firebase.firestore.FieldValue.serverTimestamp()
    }

    getDoc(coll: string, docId: string) {
        return this.afs.collection(coll).doc(docId).valueChanges();
    }

    getDocs(coll: string, filters?: any) {

        if (filters) {
            if (filters.name > "") {
                return this.afs.collection(coll, ref =>
                    ref.where('name', '>=', filters.name)
                        .where('delete_flag', '==', 'N')
                        .limit(25)
                        .orderBy('name', 'desc')
                )
                    .snapshotChanges().map(actions => {
                        return actions.map(a => {
                            const data = a.payload.doc.data();
                            const id = a.payload.doc.id;
                            return { id, ...data };
                        });
                    });
            }
            if (filters.phone > 0) {
                return this.afs.collection(coll, ref =>
                    ref.where('phone', '>=', filters.phone)
                        .where('delete_flag', '==', 'N')
                        .limit(25)
                        .orderBy('phone', 'desc')
                )
                    .snapshotChanges().map(actions => {
                        return actions.map(a => {
                            const data = a.payload.doc.data();
                            const id = a.payload.doc.id;
                            return { id, ...data };
                        });
                    });
            } else {
                return this.afs.collection(coll, ref =>
                    ref.where('updatedAt', '>=', filters.fromdt)
                        .where('updatedAt', '<', filters.todt)
                        .where('delete_flag', '==', 'N')
                        .limit(25)
                        .orderBy('updatedAt', 'desc')
                )
                    .snapshotChanges().map(actions => {
                        return actions.map(a => {
                            const data = a.payload.doc.data();
                            const id = a.payload.doc.id;
                            return { id, ...data };
                        });
                    });
            }
        } else {
            return this.afs.collection(coll, ref =>
                ref.where('delete_flag', '==', 'N')
                    .limit(25)
                    //.orderBy('name')
                    .orderBy('updatedAt', "desc"))
                .snapshotChanges().map(actions => {
                    return actions.map(a => {
                        const data = a.payload.doc.data();
                        const id = a.payload.doc.id;
                        return { id, ...data };
                    });
                });
        }
    }

    getLocs(coll: string) {
        return this.afs.collection(coll, ref =>
            ref.limit(25)
                .orderBy('updatedAt', "desc"))
            .snapshotChanges().map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...data };
                });
            });
    }

    setNewDoc(coll: string, data: any, docId?: any) {
        const id = this.afs.createId();
        const item = { id, name };
        const timestamp = this.timestamp
        var docRef = this.afs.collection(coll).doc(item.id);
        return docRef.set({
            ...data,
            updatedAt: timestamp,
            createdAt: timestamp,
            delete_flag: "N",
            oprid: localStorage.getItem('eCRMkeyI')
        });
    }
    setExistingDoc(coll: string, docId: string, data: any) {
        const timestamp = this.timestamp
        var docRef = this.afs.collection(coll).doc(docId);
        return docRef.set({
            ...data,
            updatedAt: timestamp,
            createdAt: timestamp,
            delete_flag: "N"
        });
    }
    updateDoc(coll: string, docId: string, data: any) {
        const timestamp = this.timestamp
        var docRef = this.afs.collection(coll).doc(docId);
        return docRef.update({
            ...data,
            updatedAt: timestamp,
            delete_flag: "N"
        });
    }
    deleteDoc(coll: string, docId: string) {
        const timestamp = this.timestamp
        var docRef = this.afs.collection(coll).doc(docId);
        return docRef.update({
            updatedAt: timestamp,
            delete_flag: "Y"
        });
    }
    removeDoc(coll: string, docId: string) {
        const timestamp = this.timestamp
        var docRef = this.afs.collection(coll).doc(docId).delete();
    }
    //Collection functions
    addCol(ref: any, data: any) {
        const timestamp = this.timestamp
        return this.afs.collection(ref).add({
            ...data,
            updatedAt: timestamp,
            createdAt: timestamp
        });
    }

    // This method is used by LABAPI
    getData(docType: string, filter?: any) {
        let headers = new HttpHeaders();
        this.createAuthorizationHeader(headers, this._url_keys);
        return this._http.get(this._newsUrl, { headers: headers })
            .map(res => res)
            .pipe(
            catchError(this.handleError('getData', []))
            );
    }

    getNews(filter: any) {
        let _url = this._newsUrl;
        if (filter == "news") { _url = this._newsUrl; }
        if (filter == "times") { _url = this._timeNewsUrl; }
        if (filter == "fin") { _url = this._finNewsUrl; }

        let headers = new HttpHeaders();
        this.createAuthorizationHeader(headers, this._url_keys);
        return this._http.get(this._newsUrl, { headers: headers })
            .map(res => res);
    }

    createAuthorizationHeader(headers: HttpHeaders, keys) {
        headers.append('Authorization', 'Basic ' +
            btoa(keys));
    }

    createUser(userData) {
        let headers = new HttpHeaders();
        let _url = this._backendUrl + "operator.php?action=n";
        console.log(_url);
        return this._http.post(_url, JSON.stringify(userData), { headers: headers })
            .map(res => res);
    }
    loginFn(userData) {
        let headers = new HttpHeaders();
        let _url = this._backendUrl + "operator.php?action=v";
        return this._http.post(_url, JSON.stringify(userData), { headers: headers })
            .map(res => res);
    }

	/**	
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            console.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}