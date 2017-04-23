import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../rxjs-extensions';

import { Permission } from '../models/permission';
import { User } from '../models/user';

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

  updateProfile(profile: User):Observable<any> {
    var url = "https://backend-os-v2.herokuapp.com/api/user/update";
    let headers = new Headers({'Content-Type': 'application/json'});
  	headers.append("Authorization", localStorage.getItem('token'));
    return this.http.put(url, {headers: headers}).map(res => res.json());
  }

  getLocation():Observable<any>{
    var url = "https://backend-os-v2.herokuapp.com/location";
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.get(url, headers);
  }

}
