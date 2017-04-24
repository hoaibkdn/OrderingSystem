import { Injectable, HostListener, Directive } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { FoodAndDrink } from '../models/food-and-drink';

@Injectable()
export class AdminService {
  private foodUrl = "https://backend-os-v2.herokuapp.com/api/food-and-drink";
  // private foodUrl = "http://localhost:8080/api/food-and-drink";

  // private foodUrl = "src/app/models/"
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
    return this.http.get("https://backend-os-v2.herokuapp.com/api/food-and-drink-type/all", {headers: headers});
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
    return this.http.delete("https://backend-os-v2.herokuapp.com/api/food-and-drink-type/delete/" + id, {headers: headers});
  }

  createFoodAndDrinkType(body: any): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.post("https://backend-os-v2.herokuapp.com/api/food-and-drink-type", body, {headers: headers});
  }

  getAllStaff(): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.get("https://backend-os-v2.herokuapp.com/api/user/all/staff", {headers: headers});
  }

  getAllWorkingTime(id: any): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.get("https://backend-os-v2.herokuapp.com/api/working-time/all/user/" + id, {headers: headers});
  }

  deleteWorkingTimeById(id: any): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.delete("https://backend-os-v2.herokuapp.com/api/working-time/delete/" + id, {headers: headers});
  }

  createStaff(body: any): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post("https://backend-os-v2.herokuapp.com/api/user", body, {headers: headers});
  }

  deleteStaff(id: any): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.delete("https://backend-os-v2.herokuapp.com/api/user/delete/" + id, {headers: headers});
  }

  getAllTable(): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.get("https://backend-os-v2.herokuapp.com/api/table/all", {headers: headers});

  }

  getAllUnpaidInvoice(): Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.get("https://backend-os-v2.herokuapp.com/api/invoice/unpaid-invoice/", {headers: headers});
  }

  getInvoiceDetailForInvoice(invoiceID: any): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.get("https://backend-os-v2.herokuapp.com/api/invoice-detail/" + invoiceID, {headers: headers});
  }

  getTotalMonthly(): Observable<any> {
    var url = "https://backend-os-v2.herokuapp.com/api/invoice/total-monthly";
    return this.http.get(url);
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
