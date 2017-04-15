import { Injectable, HostListener, Directive } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { FoodAndDrink } from '../models/food-and-drink';
import { Rating } from '../models/Rating';
import { RatingPost } from '../models/rating-post';
import { Payment } from '../models/payment';
import { FoodCombination } from '../models/FoodCombination';

@Injectable()
export class MenuService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private foodUrl = "https://backend-os-v2.herokuapp.com/api/food-and-drink/all";
  // private foodUrl = "src/app/models/"
  private rateUrl;
  constructor(private http: Http) {}

  getFood(id:Number): Observable<FoodAndDrink[]> {
    return this.getAllFood()
        .map(food => food.filter(afood => afood.foodAndDrinkType.id === id ));
  }

  getDetail(id:Number): Observable<FoodAndDrink> {
    return this.getAllFood()
        .map(food => food.filter(afood => afood.id === id ))[0];
  }

  getAllFood(): Observable<FoodAndDrink[]> {
    return this.http.get(this.foodUrl)
        .map(response => response.json() as FoodAndDrink[]);
  }

  //get from JSON rating, check exist, post into JSON
  getRate(type: number): Observable<Rating> {
    this.rateUrl = "https://backend-os-v2.herokuapp.com/api/rate/"+type+"/num-of-people";
    console.log("url "+ this.rateUrl);

    return this.http.get(this.rateUrl)
        .map(response => response.json() as Rating);
  }

  updateRate(rating: RatingPost): Promise<RatingPost> {
    var rateUrl = "https://backend-os-v2.herokuapp.com/api/rate";
    return this.http.post(rateUrl, JSON.stringify(rating), {headers: this.headers})
          .toPromise()
          .then(() => rating);
  }


  postOrder(order: any): Observable<any> {
    const url = "https://backend-os-v2.herokuapp.com/api/invoice";

    if(!this.headers.get('Authorization')) {
      let token = localStorage.getItem('token');
      this.headers.append('Authorization', token);
    }
    console.log(order);
    // return null;
    return this.http.post(url, order, {headers: this.headers});
  }

  updateOrder(order: any): Observable<any> {
    const url = "https://backend-os-v2.herokuapp.com/api/invoice-detail/update";
    if(!this.headers.get('Authorization')) {
      let token = localStorage.getItem('token');
      this.headers.append('Authorization', token);
    }
    console.log(order);
    return this.http.post(url, order, {headers: this.headers});
  }
  getInvoiceId(): Observable<number> {
    const url = "";
    return this.http.get(url)
        .map(response => response.json());
  }

  paymentRequest(payment: Payment):Observable<any> {
    const url="https://backend-os-v2.herokuapp.com/api/invoice/confirm-paid/";

    let token = localStorage.getItem('token');
    console.log(token);
    // this.headers.append('Authorization', token);
    if(!this.headers) this.headers.append('Authorization', token);
    console.log(this.headers);

    return this.http.put(url, JSON.stringify(payment), {headers: this.headers});
  }

  getCombination(id: number): Observable<FoodCombination[]> {
    const url="https://backend-os-v2.herokuapp.com//api/order-combination/"+id;
    return this.http.get(url)
        .map(response => response.json());
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
