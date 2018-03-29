import { snapshotChanges } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, URLSearchParams, Headers } from '@angular/http';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as GeoFire from "geofire";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()

export class eCRMFirestoreService {
    constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore, private _http: HttpClient, private _http_h: Http) { }

    serverCol: AngularFirestoreCollection<any>;
    serverDoc: AngularFirestoreDocument<any>;

    private _newsUrl = "https://newsapi.org/v1/articles?source=the-hindu&sortBy=top&apiKey=1fbee980d10644bca6e4c3243034c10a";
    private _timeNewsUrl = "https://newsapi.org/v2/top-headlines?sources=google-news-in&apiKey=1fbee980d10644bca6e4c3243034c10a";
    private _finNewsUrl = "https://newsapi.org/v2/top-headlines?sources=financial-times&apiKey=1fbee980d10644bca6e4c3243034c10a";
    private _wikiUrl = 'http://en.wikipedia.org/w/api.php?callback=JSONP_CALLBACK';
    private _userAuthColl: string = "userauth";
    private _portalColl: string = "portaldb";
    private _userColl: string = "userdb";
    private _locColl: string = "location";
    private _custColl: string = "customer";
    private _leadColl: string = "lead";
    private _callsColl: string = "calls";
    private _salesColl: string = "sales";
    private _workColl: string = "workorder";
    private _emailsColl: string = "email";
    private _enquiryColl: string = "enquiry";
    private _visitsColl: string = "visit";
    private _visitorColl: string = "visitor";
    private _guestColl: string = "guest";
    private _hostColl: string = "host";
    private _attdColl: string = "attendance";
    private _vhColl: string = "visitregister";

    dbRef: any;
    geoFire: any;
    public lat;
    public lng;
    data;
    private userAuthData = new BehaviorSubject(undefined);
    public userPreferences = this.userAuthData.asObservable();
    public member = {
        company: '',
        counter: 25,
        usertype: 'regular',
        name: '',
        email: ''
    }
    //public userPreferences = new BehaviorSubject(undefined);
    //public userPreferences;

    getNews(filter) {
        let _url = this._newsUrl;
        if (filter == 'news') { _url = this._newsUrl; }
        if (filter == 'fin') { _url = this._finNewsUrl; }
        if (filter == 'times') { _url = this._timeNewsUrl; }
        let headers = new HttpHeaders();
        //this.createAuthorizationHeader(headers, this._url_keys);
        return this._http.get(_url, { headers: headers })
            .map(res => res);
    }

    getOneUserVisitHistory(coll: string, filters: any) {
        coll = this._userColl + "/" + localStorage.getItem('eCRMkeyC') + "/" + this.getCollectionURL(coll);
        return this.afs.collection(coll, ref =>
            ref.where('hostDocID', '==', filters)
                .limit(this.getMemberType().counter)
                .orderBy('updatedAt', "desc"))
            .snapshotChanges().map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...data };
                });
            });
    }

    getCollectionURL(filter) {
        let _collURL = "";
        if (filter == "customer") { _collURL = this._custColl; }
        if (filter == "lead") { _collURL = this._leadColl; }
        if (filter == "calls") { _collURL = this._callsColl; }
        if (filter == "sales") { _collURL = this._salesColl; }
        if (filter == "workorder") { _collURL = this._workColl; }
        if (filter == "email") { _collURL = this._emailsColl; }
        if (filter == "enquiry") { _collURL = this._enquiryColl; }
        if (filter == "visit") { _collURL = this._visitsColl; }
        if (filter == "visitor") { _collURL = this._visitorColl; }
        if (filter == "guest") { _collURL = this._guestColl; }
        if (filter == "host") { _collURL = this._hostColl; }
        if (filter == "visitregister") { _collURL = this._vhColl; }
        return _collURL;
    }

    getUserAuth(coll?: string, docId?: string) {
        if (!coll) { coll = this._userAuthColl; }
        if (!docId) { docId = this.afAuth.auth.currentUser.uid }
        return this.getDoc(coll, docId);
    }
    // this method is used when user logs in first time
    setUserAuth(uid, uname, phoneNumber, email, photoURL) {
        let data =
            {
                'authuid': uid,
                'authuname': uname,
                'authphoneNumber': phoneNumber,
                'authemail': email,
                'authphoto': photoURL
            };
        this.setExistingDoc(this._userAuthColl, uid, data);
    }
    getUserPreferences(coll?: string, docId?: string) {
        if (!coll) { coll = this._userAuthColl; }
        //console.log(this.afAuth.auth.currentUser.uid);
        if (!docId) { docId = this.afAuth.auth.currentUser.uid; }
        this.userPreferences = this.getDoc(coll, docId);
        return this.userPreferences;
    }
    getPortal(portalKey?: string) {
        let coll = this._portalColl;
        return this.afs.collection(coll, ref =>
            ref.where('key', '==', portalKey)
        ).snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { id, ...data };
            });
        });
        //return this.getDoc(coll, docId);
    }

    //helper functions// get local or serverTimestamp
    get timestamp() {
        var d = new Date();
        return d;
        //return firebase.firestore.FieldValue.serverTimestamp();
    }
    timestampMinusDays(filter) {
        var d = new Date();
        d.setDate(d.getDate() - filter);
        return d;
    }
    setExistingDoc(coll: string, docId: string, data: any) {
        const timestamp = this.timestamp
        var docRef = this.afs.collection(coll).doc(docId);
        /** 
        return docRef.update({
            ...data,
            updatedAt: timestamp,
            createdAt: timestamp,
            delete_flag: "N"
        });
        */
        return docRef.set(({
            ...data,
            updatedAt: timestamp,
            createdAt: timestamp,
            delete_flag: "N"
        }), { merge: true });
    }
    getDoc(coll: string, docId: string) {
        return this.afs.collection(coll).doc(docId).valueChanges();
    }

    setUser(formData: any, coll?: string, docId?: string) {
        if (!coll) { coll = this._userAuthColl; }
        if (!docId) { docId = this.afAuth.auth.currentUser.uid }
        //return this.setExistingDoc(coll, docId, formData);
        this.setExistingDoc(coll, docId, formData);
    }

    getMemberType() {
        this.member.counter = 25;
        this.member.usertype = 'regular';
        this.member.company = localStorage.getItem('eCRMkeyC');
        this.member.name = localStorage.getItem('eCRMkeyN');
        this.member.email = localStorage.getItem('eCRMkeyE');
        if (localStorage.getItem('eCRMkeyA') == '7PjNil') { this.member.usertype = 'regular'; }
        if (localStorage.getItem('eCRMkeyA') == '7PjAil') { this.member.usertype = 'admin'; }
        if (localStorage.getItem('eCRMkeyA') == '7PjPil') { this.member.usertype = 'pro'; }
        if (localStorage.getItem('eCRMkeyA') == '7PjNil') { this.member.counter = 25; }
        if (localStorage.getItem('eCRMkeyA') == '7PjAil') { this.member.counter = 500; }
        if (localStorage.getItem('eCRMkeyA') == '7PjPil') { this.member.counter = 50000000; }
        return this.member;
    }

    setAttendance(filePath: string, coll, docId?){
        if (coll == "attendance") {
        coll = this._attdColl; 
        coll = this._userColl + "/" + localStorage.getItem('eCRMkeyC') + "/" + coll;
        const id = this.afs.createId();
        const item = { id, name };
        const timestamp = this.timestamp
        var docRef = this.afs.collection(coll).doc(item.id);
        return docRef.set({
            path: filePath,
            lat: this.lat,
            long: this.lng,
            updatedAt: timestamp,
            createdAt: timestamp,
            delete_flag: "N",
            username: localStorage.getItem('eCRMkeyN'),
            useremail: localStorage.getItem('eCRMkeyE')
        });
        } else {
            this.updateCustomerDoc(this.getCollectionURL(coll), {'path': filePath}, docId);
        }
    }

    // gps functions
    getLocations(coll: string) {
        if (coll == "location") { coll = this._locColl; }
        if (coll == "attendance") { coll = this._attdColl; }
        coll = this._userColl + "/" + localStorage.getItem('eCRMkeyC') + "/" + coll;
        if (localStorage.getItem('eCRMkeyA') == '7PjNil') { //not an admin user
            return this.getOneUserLocs(coll);
        } else {
            return this.getAllUserLocs(coll);
        }
    }
    getOneUserLocs(coll: string) {
        return this.afs.collection(coll, ref =>
            ref.where('useremail', '==', localStorage.getItem('eCRMkeyE'))
                .limit(this.getMemberType().counter)
                .orderBy('updatedAt', "desc"))
            .snapshotChanges().map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...data };
                });
            });
    }
    getAllUserLocs(coll: string) {
        return this.afs.collection(coll, ref =>
            ref
                .limit(this.getMemberType().counter)
                .orderBy('updatedAt', "desc"))
            .snapshotChanges().map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...data };
                });
            });
    }

    public getUserLocation() {
        var positionOption = { enableHighAccuracy: false, maximumAge: Infinity, timeout: 60000 };
        var gpsSunccuss = function (currentPosition) {
            //use gps position
        };
        var gpsFailed = function () {
            //use some 3rd party position solution(get position by your device ip)
            //getPositionBy3rdParty();
        };

        /// locate the user
        if (navigator.geolocation) {
            //navigator.geolocation.getCurrentPosition((position => {
            //navigator.geolocation.watchPosition((position => {
                navigator.geolocation.getCurrentPosition((position => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                // call these two lines from another function at settime interval, only capture new GPS coords here through watchPosition
                this.data = [{ "lat": position.coords.latitude, "long": position.coords.longitude }];
                if(localStorage.getItem('eCRMkeyC')) {
                this.setLocation('location', this.data);
                }
            }), gpsFailed, positionOption);
        }
        return this.lat;
    }

    setLocation(coll: string, data: any, docId?: any) {
        if (coll == "location") { coll = this._locColl; }
        coll = this._userColl + "/" + localStorage.getItem('eCRMkeyC') + "/" + coll;

        const id = this.afs.createId();
        const item = { id, name };
        const timestamp = this.timestamp;
        var docRef = this.afs.collection(coll).doc(item.id);

        // delete all data prior to 3 days
        this.afs.collection(coll, ref =>
            //delete 3 days of history (in later versions, use #of days based on user pro memebrership type)
            ref.where('updatedAt', '<=', this.timestampMinusDays(7)))
            .snapshotChanges().forEach(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    this.deleteLocDoc('location', a.payload.doc.id)
                })
            });
        return docRef.set({
            ...data,
            updatedAt: timestamp,
            createdAt: timestamp,
            delete_flag: "N",
            username: localStorage.getItem('eCRMkeyN'),
            useremail: localStorage.getItem('eCRMkeyE')
        });
    }

    deleteLocDoc(coll, docId) {
        if (coll == "location") { coll = this._locColl; }
        coll = this._userColl + "/" + localStorage.getItem('eCRMkeyC') + "/" + coll;
        this.afs.collection(coll).doc(docId).delete();
    }

    getCustomers(coll?: string, docId?: string, filters?: any) {
        coll = this._userColl + "/" + localStorage.getItem('eCRMkeyC') + "/" + this.getCollectionURL(coll);
        //if (!docId) { docId = localStorage.getItem('eCRMkeyI'); }
        return this.getDocs(coll);
        //console.log(coll);
    }
    getFilterCustomers(coll: string, filters: any) {
        coll = this._userColl + "/" + localStorage.getItem('eCRMkeyC') + "/" + this.getCollectionURL(coll);
        //if (!docId) { docId = localStorage.getItem('eCRMkeyI'); }
        return this.getDocs(coll, filters);
        //console.log(coll);
    }

    setCustomer(coll: string, formData: any, docId?: string) {
        coll = this._userColl + "/" + localStorage.getItem('eCRMkeyC') + "/" + coll;
        return this.setNewDoc(coll, formData);
    }
    getCustomerDoc(coll: string, docId?: string, coll_userdb?: string, userId?: string) {
        if (!coll_userdb) { coll_userdb = this._userColl; }
        if (!userId) { userId = localStorage.getItem('eCRMkeyC'); }
        coll = coll_userdb + "/" + userId + "/" + this.getCollectionURL(coll);
        return this.getDoc(coll, docId);
    }
    updateCustomerDoc(coll: string, formData: any, docId?: string, coll_userdb?: string, userId?: string) {
        if (!coll_userdb) { coll_userdb = this._userColl; }
        if (!userId) { userId = localStorage.getItem('eCRMkeyC'); }
        coll = coll_userdb + "/" + userId + "/" + this.getCollectionURL(coll);
        return this.updateDoc(coll, docId, formData);
    }
    deleteCustomerDoc(coll: string, docId?: string, coll_userdb?: string, userId?: string) {
        if (!coll_userdb) { coll_userdb = this._userColl; }
        if (!userId) { userId = localStorage.getItem('eCRMkeyC'); }
        coll = coll_userdb + "/" + userId + "/" + this.getCollectionURL(coll);
        let formData = { "delete_flag": "Y" }
        return this.deleteDoc(coll, docId);
    }

    // helper functions

    getDocs(coll: string, filters?: any) {
        if (localStorage.getItem('eCRMkeyA') == '7PjNil') { //not an admin user
            if (filters) {
                if (filters.name > "") {
                    return this.afs.collection(coll, ref =>
                        ref.where('name', '>=', filters.name)
                            .where('delete_flag', '==', 'N')
                            .where('useremail', '==', localStorage.getItem('eCRMkeyE'))
                            .limit(this.getMemberType().counter)
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
                            .where('useremail', '==', localStorage.getItem('eCRMkeyE'))
                            .limit(this.getMemberType().counter)
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
                    let fromDt = new Date(filters.fromdt);
                    let toDt = new Date(filters.todt);
                    return this.afs.collection(coll, ref =>
                        ref.where('updatedAt', '>=', fromDt)
                            .where('updatedAt', '<', toDt)
                            .where('delete_flag', '==', 'N')
                            .where('useremail', '==', localStorage.getItem('eCRMkeyE'))
                            .limit(this.getMemberType().counter)
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
                        .where('useremail', '==', localStorage.getItem('eCRMkeyE'))
                        .limit(this.getMemberType().counter)
                        .orderBy('name')
                        .orderBy('updatedAt', "desc"))
                    .snapshotChanges().map(actions => {
                        return actions.map(a => {
                            const data = a.payload.doc.data();
                            const id = a.payload.doc.id;
                            return { id, ...data };
                        });
                    });
            }
        } else { // an admin user
            if (filters) {
                if (filters.name > "") {
                    return this.afs.collection(coll, ref =>
                        ref.where('name', '>=', filters.name)
                            .where('delete_flag', '==', 'N')
                            .limit(this.getMemberType().counter)
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
                            .limit(this.getMemberType().counter)
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
                    let fromDt = new Date(filters.fromdt);
                    let toDt = new Date(filters.todt);
                    return this.afs.collection(coll, ref =>
                        ref.where('updatedAt', '>=', fromDt)
                            .where('updatedAt', '<', toDt)
                            .where('delete_flag', '==', 'N')
                            .limit(this.getMemberType().counter)
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
                        .limit(this.getMemberType().counter)
                        .orderBy('name')
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
            username: localStorage.getItem('eCRMkeyN'),
            useremail: localStorage.getItem('eCRMkeyE')
        });
    }

    updateDoc(coll: string, docId: string, data: any) {
        const timestamp = this.timestamp
        var docRef = this.afs.collection(coll).doc(docId);
        return docRef.update({
            ...data,
            updatedAt: timestamp,
            delete_flag: "N",
            username: localStorage.getItem('eCRMkeyN'),
            useremail: localStorage.getItem('eCRMkeyE')
        });
    }
    deleteDoc(coll: string, docId: string) {
        const timestamp = this.timestamp
        var docRef = this.afs.collection(coll).doc(docId);
        return docRef.update({
            updatedAt: timestamp,
            delete_flag: "Y",
            username: localStorage.getItem('eCRMkeyN'),
            useremail: localStorage.getItem('eCRMkeyE')
        });
    }
    // delete all functions after this, - refactoring code


    getWiki(term: string) {
        const headers = new Headers();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
        this._wikiUrl = "https://en.wikipedia.org/w/api.php?action=query&titles" + term + "=Main%20Page&prop=revisions&rvprop=content&format=json";
        return this._http_h
            .get(this._wikiUrl, { headers })
            .map(res => res);
    }

    getUser(coll?: string, docId?: string) {
        if (!coll) { coll = this._userColl; }
        if (!docId) { docId = localStorage.getItem('eCRMkeyI'); }
        return this.getDoc(coll, docId);
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

    //Collection functions
    addCol(ref: any, data: any) {
        const timestamp = this.timestamp
        return this.afs.collection(ref).add({
            ...data,
            updatedAt: timestamp,
            createdAt: timestamp
        });
    }

    /**
* Delete a collection, in batches of batchSize. Note that this does
* not recursively delete subcollections of documents in the collection
*/
    deleteCollection(db, collectionRef, batchSize) {
        var query = this.afs.collection(collectionRef, ref =>
            ref.where('updatedAt', '<=', this.timestampMinusDays(7)));

        return function (resolve, reject) {
            this.deleteQueryBatch(collectionRef, query, batchSize, resolve, reject);
        };
    }

    deleteQueryBatch(db, query, batchSize, resolve, reject) {
        console.log("inside delete query function")
        query.get()
            .then((snapshot) => {
                // When there are no documents left, we are done
                if (snapshot.size == 0) {
                    return 0;
                }

                // Delete documents in a batch
                var batch = db.batch();
                snapshot.docs.forEach(function (doc) {
                    batch.delete(doc.ref);
                });

                return batch.commit().then(function () {
                    return snapshot.size;
                });
            }).then(function (numDeleted) {
                if (numDeleted < batchSize) {
                    resolve();
                    return;
                }

                // Recurse on the next process tick, to avoid
                // exploding the stack.
                setTimeout(function () {
                    this.deleteQueryBatch(db, query, batchSize, resolve, reject);
                }, 0);
            })
            .catch(reject);
    }
}