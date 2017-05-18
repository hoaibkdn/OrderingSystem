import { Injectable, HostListener, Directive } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/Rx';
import { serverUrl }  from './server-url.config';

@Injectable()
export class AppService {

  constructor(private http:Http) {}

  signUp(newAccount: any): Observable<any> {
    const url = serverUrl + "user";
    var headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post(url, JSON.stringify(newAccount), {headers: headers});
  }

  sendEmail(forgotPass: any): Observable<any> {
    const url = serverUrl + "auth/forgot-password";
    var headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post(url, JSON.stringify(forgotPass), {headers: headers});
  }

  reservedTable(contentTable: any): Observable<any> {
    const url = serverUrl + "reserved-table";
    var headers = new Headers({'Content-Type': 'application/json'});
    var token = localStorage.getItem('token');
    headers.append('Authorization', token);
    return this.http.post(url, JSON.stringify(contentTable), {headers: headers});
  }

  cancelReserved(contenCancel: any): Observable<any> {
    const url = serverUrl + "reserved-table/update";
    var headers = new Headers({'Content-Type': 'application/json'});
    var token = localStorage.getItem('token');
    headers.append('Authorization', token);
    return this.http.put(url, JSON.stringify(contenCancel), {headers:headers});
  }
}
