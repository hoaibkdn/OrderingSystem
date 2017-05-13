import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../rxjs-extensions';
import { serverUrl } from '../server-url.config';

@Injectable()
export class UserAuthenticationService {
	private loggedIn = false;
    redirectUrl: string;
    constructor(private http: Http) {
        this.loggedIn = !!localStorage.getItem('token');
    }

	  logIn(email: String, password: String, urlPath: String): Observable<any> {
	  	let postUrl = serverUrl + "auth/login";
	  	let headers = new Headers({'Content-Type': 'application/json'});
	        return this.http
	            .post(
	            postUrl,
	            JSON.stringify({ email, password, urlPath}),
	            { headers: headers});
	    }

	  loginByFacebook(accessToken: String): Observable<any> {
	    let url = serverUrl + "auth/social/facebook";
	    let headers = new Headers({'Content-Type': 'application/json'});
	    return this.http
	            .post(
	            url,
	            JSON.stringify({ accessToken }),
	            { headers: headers});
	  }

	  loginByGoogle(idTokenString: String): Observable<any> {
	    let url = serverUrl + "auth/social/google";
	    let headers = new Headers({'Content-Type': 'application/json'});
	    return this.http
	            .post(
	            url,
	            JSON.stringify({ idTokenString }),
	            { headers: headers});
	  }

	  	isLoggedIn() {
        	return this.loggedIn;
	    }

	    setLoggedIn(logined: boolean) {
	        this.loggedIn = logined;
	    }


}
