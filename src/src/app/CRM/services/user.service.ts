import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
	isLoggedin: boolean;

	private _Url_b = "&include_docs=true&limit=25";
	private _useridUrl_a = "http://127.0.0.1:5984/ehcm_users/";
	private _useridUrl = "http://127.0.0.1:5984/ehcm_users/_design/app/_view/viewOne?key=\"";

	private _urlPortal = "http://127.0.0.1:5984/ehcm_config/_design/app/_view/viewOne?key=\"";
	private _urlPortalNames = "http://127.0.0.1:5984/ehcm_config/_design/app/_view/portalDefs";

	private _userProfileUrl = "http://127.0.0.1:5984/ehcm_userprofiles/_design/app/_view/viewOne?key=\"";
	private _userProfileUrl_a = "http://127.0.0.1:5984/ehcm_userprofiles/";

	private _visiteeUrl = "https://ashuklax.cloudant.com/ehcm_visitee/";
	private _visiteeUrl_p = "https://ashuklax.cloudant.com/ehcm_visitee/_design/app/_view/viewOne?key=\"";
	private _visiteeUrl_s = "https://ashuklax.cloudant.com/ehcm_visitee/_design/app/_view/viewSearchTxt?startkey=\"";

	//private _commentsUrl = "https://ashuklax.cloudant.com/llb_postcomments/";
	private _commentsUrl = "https://ashuklax.cloudant.com/ehcm_comments/";
	private _commentsUrl_p = "https://ashuklax.cloudant.com/ehcm_comments/_design/app/_view/viewOne?key=\"";
	private _commentsUrl_s = "https://ashuklax.cloudant.com/ehcm_comments/_design/app/_view/viewSearchTxt?startkey=\"";


	// login-form
	loginFn(localUser) {
		this.isLoggedin = false;
		let headers = new Headers();
		let _url = this._useridUrl + localUser + "\"";
		//this.createAuthorizationHeader(headers, this._urlUser_keys);
		return this._http.get(_url, { headers: headers })
			.map(res => res.json());
	}
	// sign-up/edituser-form
	getUser(userId) {
		let headers = new Headers();
		//	this.createAuthorizationHeader(headers, this._urlUser_keys);
		let _url = this._useridUrl + userId + "\"" + this._Url_b;
		return this._http.get(_url, { headers: headers })
			.map(res => res.json());
	}
	// sign-up/edituser-form
	updateUser(user) {
		let headers = new Headers();
		//		this.createAuthorizationHeader(headers, this._urlUser_keys);
		//		headers.append('Content-Type', 'application/json');
		let _url = this._useridUrl_a + user._id;
		return this._http.put(_url, JSON.stringify(user), { headers: headers })
			.map(res => res.json());
	}

	getPortalNames(portal?) {
		if (!portal) { portal = "ELISH"; }
		let headers = new Headers();
		//this.createAuthorizationHeader(headers, this._url_keys);
		let _url = this._urlPortalNames;
		return this._http.get(_url, { headers: headers })
			.map(res => res.json());
	}
	getPortalDefaults(portal?) {
		if (!portal) { portal = "ELISH"; }
		let headers = new Headers();
		//this.createAuthorizationHeader(headers, this._url_keys);
		let _url = this._urlPortal + portal + "\"" + this._Url_b;
		return this._http.get(_url, { headers: headers })
			.map(res => res.json());
	}

	//edituserprofile-form
	getUserProfile(userId) {
		let headers = new Headers();
		//	this.createAuthorizationHeader(headers, this._urlUserProfile_keys);
		let _url = this._userProfileUrl + userId + "\"" + this._Url_b;
		//return this._http.get(this.getUserProfileUrl(userId), { headers: headers })
		return this._http.get(_url, { headers: headers })
			.map(res => res.json());
	}

	//edituserprofile-form
	updateUserProfile(user) {
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		let _url = this._userProfileUrl_a + user._id;
		return this._http.put(_url, JSON.stringify(user), { headers: headers })
			.map(res => res.json());
	}

	// inbox page
	getInbox(userId, searchFilter?) {
		//let _inboxUrl_g = this._inboxUrl_a + "userid:" + userId + this._inboxUrl_b + "&sort=[\"date<string>\"]";
		let _inboxUrl_g = this._inboxUrl_a + "userid:" + userId + this._inboxUrl_b + "&descending=true";
		if (searchFilter != "") {
			_inboxUrl_g = this._inboxUrl_a + "userid:" + userId +
				' AND (subject:"' + searchFilter + '*" OR message:"' + searchFilter + '*")' + this._inboxUrl_b + "&sort=[\"date<string>\"]";
		}
		//console.log(_inboxUrl_g);
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._inboxUrl_keys);
		headers.append('Content-Type', 'application/json');
		return this._http.get(_inboxUrl_g, { headers: headers })
			.map(res => res.json());
	}

	// email page
	updateEmail(userData) {
		let headers = new Headers();

		// send actual email first
		let _url = this._backendUrl + "emailHandler.php?action=e";
		let x = this._http.post(_url, JSON.stringify(userData), { headers: headers })
			.map(res => res.json()).subscribe(x => {
				// console.log(x);
			},
			err => {
				console.log("API didn't respond.");
			});

		this.createAuthorizationHeader(headers, this._inboxUrl_keys);
		headers.append('Content-Type', 'application/json');
		let _inboxUrl_u = this._inboxUrl
		return this._http.post(_inboxUrl_u, JSON.stringify(userData), { headers: headers })
			.map(res => res.json());
	}

	// email page
	deleteEmail(userData) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._inboxUrl_keys);
		headers.append('Content-Type', 'application/json');
		let _inboxUrl_d = this._inboxUrl + userData._id + "?rev=" + userData._rev;
		return this._http.delete(_inboxUrl_d, { headers: headers })
			.map(res => res.json());
	}

	// visitee page
	getVisitee(primaryFilter,searchText) {
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		let _url = "";
		if(primaryFilter=="p") { _url = this._visiteeUrl_p + searchText + "\"" + this._Url_b; }
		if(primaryFilter=="s") { 
			if(searchText == "A") {
			_url = this._visiteeUrl_s + searchText + "\"&endkey=\"" + "ZZZZ\"" + this._Url_b; 
			} else {
			_url = this._visiteeUrl_s + searchText + "\"&endkey=\"" + searchText + "ZZZZ\"" + this._Url_b; 
			}
	}
		return this._http.get(_url, { headers: headers })
			.map(res => res.json());
	}
	setVisitee(userData) {
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this._http.post(this._visiteeUrl, JSON.stringify(userData), { headers: headers })
			.map(res => res.json());
	}

	// visitee page
	getComments(searchText) {
		let _url = this._commentsUrl_p + searchText + "\"" + this._Url_b;
		//console.log(_url)
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this._http.get(_url, { headers: headers })
			.map(res => res.json());
	}
	// visitee page
	setComments(userData) {
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this._http.post(this._commentsUrl, JSON.stringify(userData), { headers: headers })
			.map(res => res.json());
	}

	// delete all functions after this line
	isPortal = "*";
	idFilter = "";
	private _userUrl = "";
	private _userUrlProfile = ""

	private _backendUrl = "http://elisheducation.com/APP/LLBAPI/";
	private _url_keys = "tingshickerstornippooneg:7ba60f9d1b4bb5ef9ddb7613f6de730f420a44a1";

	//	private _urlPortal = "https://ashuklax.cloudant.com/yp_definitions/portaldefinition";
	private _urlService = "https://ashuklax.cloudant.com/yp_definitions/servicedefinition";
	private _urlDirectory = "https://ashuklax.cloudant.com/yp_definitions/directorydefinition";
	private _urlSponsor = "https://ashuklax.cloudant.com/yp_definitions/sponsordefinition";

	private _clasifiedUrl = "https://ashuklax.cloudant.com/yp_classifieds/";
	private _clasifiedUrl_view = "https://ashuklax.cloudant.com/yp_classifieds/_design/view/_view/viewAll2?descending=true&limit=40";
	private _clasifiedUrl_search = "https://ashuklax.cloudant.com/yp_classifieds/_design/app/_search/searchFilter?q=";
	private _clasifiedUrl_keys = "aingrercumbletimmencemas:079c57ea36521be30dbba06330896000fe268e6d";

	private _directoryUrl = "https://ashuklax.cloudant.com/yp_directory/";
	private _directoryUrl_view = "https://ashuklax.cloudant.com/yp_directory/_design/view/_view/viewAll2?descending=true&limit=40";
	private _directoryUrl_search = "https://ashuklax.cloudant.com/yp_directory/_design/app/_search/searchFilter?q=";
	private _directoryUrl_keys = "tedlyrancedislesirdeedie:ca8c2ea5c5e84ca77fba95fad18ddceb7c049087";

	private _serviceUrl = "https://ashuklax.cloudant.com/op_services/";
	private _serviceUrl_view = "https://ashuklax.cloudant.com/op_services/_design/view/_view/viewAll2?descending=true&limit=40";
	private _serviceUrl_search = "https://ashuklax.cloudant.com/op_services/_design/app/_search/searchFilter?q=";
	private _serviceUrl_keys = "turtursearninecoutheremp:992431d273fd8e1b551d739e3b74fecb47afff81";

	private _llbpediaUrl = "https://ashuklax.cloudant.com/llb_pediadocuments/";
	private _llbpediaUrl_view_1 = "https://ashuklax.cloudant.com/llb_pediadocuments/_design/view/_view/viewAll";
	private _llbpediaUrl_view_2 = "?descending=true&limit=40";
	private _llbpediaUrl_search = "https://ashuklax.cloudant.com/llb_pediadocuments/_design/app/_search/searchFilter?q=";
	private _llbpediaUrl_keys = "aniessiddlessoundegueste:13e70299c25069da2aaf0c72fbec888e487301b4";

	private _urlLawService = "https://ashuklax.cloudant.com/llb_definitions/servicedefinition";
	private _urlLawDirectory = "https://ashuklax.cloudant.com/llb_definitions/directorydefinition";
	private _urlLawArea = "https://ashuklax.cloudant.com/llb_definitions/areadefinition";
	private _llbdefUrl_keys = "artheromaysionotherstima:67f23c85a30d81fcd1f0f9ad9fd4f693657e80ea";

	private _llbpostcomments = "https://ashuklax.cloudant.com/llb_postcomments/";
	private _llbpostcomments_search = "https://ashuklax.cloudant.com/llb_postcomments/_design/app/_search/searchFilter?q=";
	private _llbpostcomments_keys = "blezeastereeksguisemerva:76fc333a28c676812872fbeadbce1f11f167e8ad";

	// 1fbee980d10644bca6e4c3243034c10a news api key ashuklax@gmail.com https://newsapi.org/google-news-api
	// https://newsapi.org/v1/articles?source=the-hindu&sortBy=top&apiKey=1fbee980d10644bca6e4c3243034c10a
	private _newsUrl = "https://newsapi.org/v1/articles?source=the-hindu&sortBy=top&apiKey=1fbee980d10644bca6e4c3243034c10a";

	private _url = "https://ashuklax.cloudant.com/llb_users/";
	private _url_a = "https://ashuklax.cloudant.com/llb_users/_design/app/_search/searchAll?q=";
	private _url_b = "&include_docs=true";
	private _urlUser_keys = "hedinksoondurcelaterecte:9ac63829f12e89962330679bac144df49aeec883";

	private _urlProfile = "https://ashuklax.cloudant.com/llb_usersprofile/";
	private _urlProfile_a = "https://ashuklax.cloudant.com/llb_usersprofile/_design/app/_search/searchAll?q=";
	private _urlProfile_b = "&include_docs=true";
	private _urlUserProfile_keys = "butsturightsparetheretio:ae4201464dbb1b74c13af38b720975c6c7e65341";

	private _inboxUrl = "https://ashuklax.cloudant.com/llb_email/";
	private _inboxUrl_a = "https://ashuklax.cloudant.com/llb_email/_design/app/_search/searchAll?q=";
	private _inboxUrl_b = "&include_docs=true";
	private _inboxUrl_keys = "ilecruenstricandisternot:b73054f6959d4920db69946a4cb5b55c0e3de1dd";

	private _casesUrl = "https://ashuklax.cloudant.com/llb_cases/";
	private _casesUrl_a = "https://ashuklax.cloudant.com/llb_cases/_design/app/_search/searchAll?q=";
	private _casesUrl_b = "&include_docs=true";
	private _casesUrl_keys = "thatcherizedidgerysesese:4dc06fb227278587c12327e355f9fdc6622f7158";

	private _picUrl = "https://ashuklax.cloudant.com/llb_userpics/";
	private _picUrl_keys = "arterhollydnalroodyincti:9695b1bb0878c586deb4e89bdf41a58c8f19a133";

	private _customerUrl = "https://ashuklax.cloudant.com/ecrm_txn/";
	private _customerUrl_view_1 = "https://ashuklax.cloudant.com/ecrm_txn/_design/view/_view/viewAll";
	private _customerUrl_view_2 = "?descending=true&limit=40";
	private _customerUrl_search = "https://ashuklax.cloudant.com/ecrm_txn/_design/app/_search/searchAll?q=";
	private _customerUrl_keys = "ingtheenstartivereyedore:25b6fa7f708dff63dd28d60e9c436215cab00674";

	createAuthorizationHeader(headers: Headers, keys) {
		headers.append('Authorization', 'Basic ' +
			btoa(keys));
	}

	constructor(private _http: Http) {
	}

	// retire this later
	getPortalDefs(portal?) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._url_keys);
		return this._http.get(this._urlPortal, { headers: headers })
			.map(res => res.json());
	}

	// area defs
	getAreaDefs(portal?) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._llbdefUrl_keys);
		return this._http.get(this._urlLawArea, { headers: headers })
			.map(res => res.json());
	}

	// clasifieds service type URL
	getServiceDefs(portal?) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._url_keys);
		return this._http.get(this._urlService, { headers: headers })
			.map(res => res.json());
	}

	// Law type URL like Family Law...
	getLawServiceDefs(portal?) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._llbdefUrl_keys);
		return this._http.get(this._urlLawService, { headers: headers })
			.map(res => res.json());
	}
	// directory defs
	getDirectoryDefs(portal?) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._llbdefUrl_keys);
		return this._http.get(this._urlLawDirectory, { headers: headers })
			.map(res => res.json());
	}

	getClassifieds(filter) {
		let _url = this._clasifiedUrl_view;
		if (filter) {
			_url = this._clasifiedUrl_search + filter + "&include_docs=true&limit=90";
		}
		//console.log(_url);
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._clasifiedUrl_keys);
		headers.append('Content-Type', 'application/json');
		return this._http.get(_url, { headers: headers })
			.map(res => res.json());
	}

	getDirectory(filter) {
		let _url = this._directoryUrl_view;
		if (filter) {
			_url = this._directoryUrl_search + filter + "&include_docs=true&limit=90";
			//console.log(_url);
		}

		//		console.log(_url);
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._directoryUrl_keys);
		headers.append('Content-Type', 'application/json');
		return this._http.get(_url, { headers: headers })
			.map(res => res.json());
	}

	postAd(userData) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._clasifiedUrl_keys);
		headers.append('Content-Type', 'application/json');
		return this._http.post(this._clasifiedUrl, JSON.stringify(userData), { headers: headers })
			.map(res => res.json());
	}

	postDirectory(userData) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._directoryUrl_keys);
		headers.append('Content-Type', 'application/json');
		return this._http.post(this._directoryUrl, JSON.stringify(userData), { headers: headers })
			.map(res => res.json());
	}

	getServices(filter) {
		let _url = this._serviceUrl_view;
		if (filter) {
			_url = this._serviceUrl_search + filter + "&include_docs=true";
		}

		//		console.log(_url);
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._serviceUrl_keys);
		headers.append('Content-Type', 'application/json');
		return this._http.get(_url, { headers: headers })
			.map(res => res.json());
	}

	postServices(userData) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._serviceUrl_keys);
		headers.append('Content-Type', 'application/json');
		return this._http.post(this._serviceUrl, JSON.stringify(userData), { headers: headers })
			.map(res => res.json());
	}

	getNews() {
		let headers = new Headers();
		//this.createAuthorizationHeader(headers, this._url_keys);
		return this._http.get(this._newsUrl, { headers: headers })
			.map(res => res.json());
	}

	getSponsorContent() {
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._url_keys);
		headers.append('Content-Type', 'application/json');
		return this._http.get(this._urlSponsor, { headers: headers })
			.map(res => res.json());
	}

	getLLBPedia(doctype, filter?) {
		let _url = this._llbpediaUrl_view_1 + doctype + this._llbpediaUrl_view_2;
		if (filter) {
			_url = this._llbpediaUrl_search + "documenttype:" + doctype + " AND " + filter + "&include_docs=true&limit=90";
			//_url = this._llbpediaUrl_search + filter + "&include_docs=true&limit=90";
		}
		//console.log(_url);
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._llbpediaUrl_keys);
		headers.append('Content-Type', 'application/json');
		return this._http.get(_url, { headers: headers })
			.map(res => res.json());
	}
	postLLBPedia(userData) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._llbpediaUrl_keys);
		headers.append('Content-Type', 'application/json');
		return this._http.post(this._llbpediaUrl, JSON.stringify(userData), { headers: headers })
			.map(res => res.json());
	}
	
	private getUserUrl(userId) {
		this._userUrl = this._url_a + "name:" + userId + this._url_b;
		//console.log(this._userUrl);
		return this._userUrl;
	}

	bkp_getCase(userId, searchFilter?, caseId?) {
		let _casesUrl_g = this._casesUrl_a + "userid:" + userId + "&sort=[\"srno\"]";
		if (searchFilter != "") {
			_casesUrl_g = this._casesUrl_a + "userid:" + userId +
				' AND (caseno:"*' + searchFilter + '*" OR courtno:"*' + searchFilter + '*" OR srno:"*' + searchFilter + '*" OR contact1:"' + searchFilter + '*" OR parties:"' + searchFilter + '*")' + this._casesUrl_b + "&sort=[\"srno\"]";
		}
		if (caseId) {
			_casesUrl_g = this._casesUrl + caseId;
		}
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._casesUrl_keys);
		headers.append('Content-Type', 'application/json');
		return this._http.get(_casesUrl_g, { headers: headers })
			.map(res => res.json());
	}
	deleteCase(userData) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._casesUrl_keys);
		headers.append('Content-Type', 'application/json');
		let _casesUrl_d = this._casesUrl + userData._id + "?rev=" + userData._rev;
		return this._http.delete(_casesUrl_d, { headers: headers })
			.map(res => res.json());
	}
	updateCase(userData) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._casesUrl_keys);
		headers.append('Content-Type', 'application/json');
		let _casesUrl_u = this._casesUrl
		return this._http.post(_casesUrl_u, JSON.stringify(userData), { headers: headers })
			.map(res => res.json());
	}
	forgotPasword(userData) {
		let headers = new Headers();
		let _url = this._backendUrl + "resetemailHandler.php?action=f";
		return this._http.post(_url, JSON.stringify(userData), { headers: headers })
			.map(res => res.json());
	}
	getLawyer(searchFilter?, lawyerid?) {
		let _urlProfile_g = this._urlProfile_a + "member:Standard&sort=[\"srno\"]";
		if (searchFilter != "") {
			_urlProfile_g = this._urlProfile_a + "member:Standard AND "
				+ '(area:"*' + searchFilter + '*" OR title:"*' + searchFilter + '*" OR headline:"*' + searchFilter + '*" OR name:"' + searchFilter + '*" OR expertise:"' + searchFilter + '*")' + this._urlProfile_b + "&sort=[\"srno\"]";
		}
		if (lawyerid) {
			_urlProfile_g = this._urlProfile + lawyerid;
		}
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._urlUserProfile_keys);
		headers.append('Content-Type', 'application/json');
		return this._http.get(_urlProfile_g, { headers: headers })
			.map(res => res.json());
	}

	// from mfpedia
	private _urlMDPedia = "https://ashuklax.cloudant.com/md_mdpedia/";
	private _urlMDPedia_search = "https://ashuklax.cloudant.com/md_mdpedia/_design/app/_search/searchAll?q=";
	private _urlMDPedia_tail = "&include_docs=true";
	private _urlMDPedia_keys = "";

	getMDPedia(searchFilter?, docId?) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._urlMDPedia_keys);
		headers.append('Content-Type', 'application/json');

		let _urlMDPedia_g = this._urlMDPedia_search + 'doctype:mdpedia';
		if (searchFilter != "") {
			_urlMDPedia_g = this._urlMDPedia_search + 'doctype:mdpedia&' + "userid:" + docId +
				' AND (caseno:"*' + searchFilter + '*" OR courtno:"*' + searchFilter + '*" OR srno:"*' + searchFilter + '*" OR contact1:"' + searchFilter + '*" OR parties:"' + searchFilter + '*")' + this._urlMDPedia_tail + "&sort=[\"srno\"]";
		}
		if (docId) {
			_urlMDPedia_g = this._urlMDPedia + docId + this._urlMDPedia_tail;
		}
		return this._http.get(_urlMDPedia_g, { headers: headers })
			.map(res => res.json());
	}

	setPic(userData) {
		console.log(userData);
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._picUrl_keys);
		headers.append('Content-Type', 'application/json');
		this._picUrl = this._picUrl + userData.username;
		return this._http.post(this._picUrl, JSON.stringify(userData), { headers: headers })
			.map(res => res.json());

		/**
		let headers = new Headers();
        let _url = this._backendUrl + "photohandler.php?action=p";
		return this._http.post(_url, JSON.stringify(userData), { headers: headers })
			.map(res => res.json());
		*/
	}
	getPic(userData) {
		let headers = new Headers();
		let _url = this._backendUrl + "photohandler.php?action=g";
		return this._http.get(_url, { headers: headers })
			.map(res => res.json());
	}

	//edituser-form
	setCRM(userData) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._customerUrl_keys);
		headers.append('Content-Type', 'application/json');
		return this._http.post(this._customerUrl, JSON.stringify(userData), { headers: headers })
			.map(res => res.json());
	}
	getCRM(userid, doctype, portal, srchtext?) {
		//let _url = this._customerUrl_search + "userid:" + userid + " AND doctype:" + doctype + " AND portal:" + portal + "&include_docs=true&limit=90&sort=[\"date<string>\"]";
		let _url = this._customerUrl_search + "userid:" + userid + " AND doctype:" + doctype + " AND portal:" + portal + "&include_docs=true&limit=90&startkey=\"2017-01-01\"&endkey=\"2017-12-31\"";
		if (srchtext != "") {
			//_url = this._customerUrl_search + "userid:" + userid + " AND doctype:" + doctype + " AND (customerid:" + srchtext + " OR name: "+ srchtext + ") AND portal:" + portal + "&include_docs=true&limit=90&sort=[\"date<string>\"]";
			_url = this._customerUrl_search + "userid:" + userid + " AND doctype:" + doctype + " AND (customerid:" + srchtext + " OR name: " + srchtext + ") AND portal:" + portal + "&include_docs=true&limit=90&startkey=\"2017-01-01\"&endkey=\"2017-12-31\"";
		}
		//console.log(_url);
		let headers = new Headers();
		this.createAuthorizationHeader(headers, this._customerUrl_keys);
		headers.append('Content-Type', 'application/json');
		return this._http.get(_url, { headers: headers })
			.map(res => res.json());
	}
}
