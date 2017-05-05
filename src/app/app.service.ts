import { Injectable, HostListener, Directive } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/Rx';

@Injectable()
export class AppService {

  constructor(private http:Http) {}

  signUp(newAccount: any): Observable<any> {
    const url = "https://backend-os-v2.herokuapp.com/api/user";
    var headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post(url, JSON.stringify(newAccount), {headers: headers});
  }
}
