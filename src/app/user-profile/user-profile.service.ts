import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../rxjs-extensions';

import { Permission } from '../models/permission';

@Injectable()
export class UserProfileService {

  constructor(private http: Http) {

  }

  getPermission(): Observable<Permission[]>{
  	let url = "https://backend-os-v2.herokuapp.com/api/user/permission";
  	let headers = new Headers({'Content-Type': 'application/json'});
  	headers.append("Authorization", localStorage.getItem('token'));
  	return this.http.get(url, {headers: headers}).map(res => res.json() as Permission[]);
  }

  getInfo(): Observable<any>{
  	let url = "https://backend-os-v2.herokuapp.com/api/user/info";
  	let headers = new Headers({'Content-Type': 'application/json'});
  	headers.append("Authorization", localStorage.getItem('token'));
  	return this.http.get(url, {headers: headers}).map(res => res.json());
  }

}
