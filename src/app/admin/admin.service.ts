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