import { Injectable, HostListener, Directive } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { TotalMoney } from './../models/total-money';
import { FoodAndDrink } from '../models/food-and-drink';
import { ReservedTable } from '../models/reserved-table';
import { serverUrl } from '../server-url.config';

@Injectable()
export class AdminService {
  private foodUrl = serverUrl + "food-and-drink";
  private rateUrl;
  constructor(private http: Http) {}

  updateFoodAndDrink(body: any): Observable<any>{
  	let headers = new Headers({'Content-Type': 'application/json'});
  	let token = localStorage.getItem('token');
  	headers.append("Authorization", token);
  	return this.http.put(this.foodUrl + "/update", body, {headers: headers});
  }

  deleteFoodAndDrink(id): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.delete(this.foodUrl + "/delete/" + id, {headers: headers});
  }

  getAllFoodAndDrinkType(): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.get(serverUrl + "food-and-drink-type/all", {headers: headers});
  }

  createFoodAndDrink(body: any): any{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.post(this.foodUrl, body, {headers: headers});
  }

  getAllFoodAndDrinkByType(id: any): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.get(this.foodUrl + "/type/" + id, {headers: headers});
  }

  deleteFoodAndDrinkType(id: any): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.delete(serverUrl + "food-and-drink-type/delete/" + id, {headers: headers});
  }

  createFoodAndDrinkType(body: any): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.post(serverUrl + "food-and-drink-type", body, {headers: headers});
  }

  getAllStaff(): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.get(serverUrl + "user/all/staff", {headers: headers});
  }

  getAllWorkingTime(id: any): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.get( serverUrl + "working-time/all/user/" + id, {headers: headers});
  }

  getLastWorkingTime(): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.get(serverUrl + "working-time/last", {headers: headers});
  }

  deleteWorkingTimeById(id: any): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.delete(serverUrl + "working-time/delete/" + id, {headers: headers});
  }

  createStaff(body: any): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post(serverUrl + "user", body, {headers: headers});
  }

  deleteStaff(id: any): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.delete(serverUrl + "user/delete/" + id, {headers: headers});
  }

  getAllTable(): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.get(serverUrl + "table/all", {headers: headers});
  }

  getAllUnpaidInvoice(): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.get(serverUrl + "invoice/unpaid-invoice/", {headers: headers});
  }

  getInvoiceDetailForInvoice(invoiceID: any): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.get(serverUrl + "invoice-detail/" + invoiceID, {headers: headers});
  }

  getTotalMonthly(): Observable<TotalMoney[]> {
    var url = serverUrl + "invoice/total-monthly";
    return this.http.get(url)
      .map(res => res.json() );
  }

  setMadeForInvoice(invoiceId: any): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.put(serverUrl + "invoice/is-made/" + invoiceId, {}, {headers: headers});
  }

  createWorkingTime(body: any): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.post(serverUrl + "working-time", body, {headers: headers});
  }

  createTable(sizeTable: any): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.post(serverUrl + "table", {size: sizeTable}, {headers: headers});
  }

  getAllInvoice(): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.get(serverUrl + "invoice/all-invoices", {headers: headers});
  }

  getAllShifts(): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.get(serverUrl + "shift/all", {headers: headers});
  }

  getAllCustomer(): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.get(serverUrl + "user/all/customer", {headers: headers});
  }

  reservedTable(contentTable: any): Observable<any> {
    const url = serverUrl + "reserved-table";
    var headers = new Headers({'Content-Type': 'application/json'});
    var token = localStorage.getItem('token');
    headers.append('Authorization', token);
    return this.http.post(url, JSON.stringify(contentTable), {headers: headers});
  }

  cancelReserved(contentCancel: any): Observable<any> {
    const url = serverUrl + "reserved-table/update";
    var headers = new Headers({'Content-Type': 'application/json'});
    var token = localStorage.getItem('token');
    headers.append('Authorization', token);
    return this.http.put(url, JSON.stringify(contentCancel), {headers:headers});
  }

  getReservedTable(): Observable<ReservedTable[]> {
    const url = serverUrl + "reserved-table";
    var headers = new Headers({'Content-Type': 'application/json'});
    var token = localStorage.getItem('token');
    headers.append('Authorization', token);
    // console.log('token for admin ', token);
    return this.http.get(url,{headers:headers})
      .map(res => res.json() as ReservedTable[]);
  }

  getUserInfo(userId: number): Observable<any>{
    let url = serverUrl + "user/" + userId;
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append("Authorization", localStorage.getItem('token'));
    return this.http.get(url, {headers: headers}).map(res => res.json());
  }

  private extractData(res: Response) {
        let body = res.json();
        return body.data || {};
  }

  private handleError(error: any) {
      let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
      return Observable.throw(errMsg);
  }

}
