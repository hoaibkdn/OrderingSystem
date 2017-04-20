import { Injectable, HostListener, Directive } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { User } from '../models/user';
import { Invoice } from '../models/invoice';
import { InvoiceDetail } from '../models/invoice-detail';


@Injectable()
export class HistoryInvoiceService {
  private headers = new Headers({'Content-Type': 'application/json'});
  constructor( private http: Http) {}

  getAllInvoice(): Observable<any> {
    const url = 'https://backend-os-v2.herokuapp.com/api/invoice/all';
    if(!this.headers.get('Authorization')) {
      let token = localStorage.getItem('token');
      this.headers.append('Authorization', token);
    }
    return this.http.get(url, {headers: this.headers})
        .map(response => response.json());
  }

  getInvoiceDetail(id:string): Observable<InvoiceDetail[]> {
    const url = 'https://backend-os-v2.herokuapp.com/api/invoice-detail/'+id;
    if(!this.headers.get('Authorization')) {
      let token = localStorage.getItem('token');
      this.headers.append('Authorization', token);
    }
    return this.http.get(url, {headers: this.headers})
        .map(response => response.json() as InvoiceDetail[]);
  }
}
