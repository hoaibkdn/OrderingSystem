import { Injectable, HostListener, Directive } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { InvoiceDetail } from '../models/invoice-detail';

@Injectable()
export class UserHistoryService {
  invoiceDetail: InvoiceDetail[];
  private headers = new Headers({'Content-Type': 'application/json'});
  constructor(
    private http: Http
  ){}

  getAllDetail(): Observable<InvoiceDetail[]>{
    const url = 'http://192.168.0.106:8080/api/invoice-detail/all';
    if(!this.headers.get('Authorization')) {
      let token = localStorage.getItem('token');
      this.headers.append('Authorization', token);
    }
    console.log('header ', this.headers);

    return this.http.get(url, {headers: this.headers})
      .map(res => res.json() as InvoiceDetail[]);
  }

}
