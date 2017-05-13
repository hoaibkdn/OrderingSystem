import { Injectable, HostListener, Directive } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import { FoodAndDrink } from '../models/food-and-drink';
import { Rating } from '../models/Rating';
import { RatingPost } from '../models/rating-post';
import { Payment } from '../models/payment';
import { FoodCombination } from '../models/FoodCombination';
import { FoodAndDrinkType } from '../models/food-and-drink-type';
import { serverUrl } from '../server-url.config';

@Injectable()
export class MenuService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private foodUrl = serverUrl + "/food-and-drink/all";
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
    this.rateUrl = serverUrl + "rate/"+type+"/num-of-people";
    console.log("url "+ this.rateUrl);

    return this.http.get(this.rateUrl)
        .map(response => response.json() as Rating);
  }

  updateRate(rating: RatingPost): Observable<any> {
    var rateUrl = serverUrl + "rate";
    return this.http.post(rateUrl, JSON.stringify(rating), {headers: this.headers});
  }


  postOrder(order: any): Observable<any> {
    const url = serverUrl + "invoice";

    if(!this.headers.get('Authorization')) {
      let token = localStorage.getItem('token');
      this.headers.append('Authorization', token);
    }
    console.log(order);
    // return null;
    return this.http.post(url, order, {headers: this.headers})
        .catch(this.handleError);
  }

  updateOrder(order: any): Observable<any> {
    const url = serverUrl + "invoice-detail/update";
    if(!this.headers.get('Authorization')) {
      let token = localStorage.getItem('token');
      this.headers.append('Authorization', token);
    }
    console.log(order);
    return this.http.post(url, order, {headers: this.headers})
            .catch(this.handleError);
  }
  getInvoiceId(): Observable<number> {
    const url = "";
    return this.http.get(url)
        .map(response => response.json());
  }

  paymentRequest(payment: Payment):Observable<any> {
    const url= serverUrl + "invoice/confirm-paid/";
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    console.log(headers);
    return this.http.put(url, JSON.stringify(payment), {headers: headers});
  }

  getCombination(id: number): Observable<FoodCombination[]> {
    const url= serverUrl + "order-combination/"+id;
    return this.http.get(url)
        .map(response => response.json());
  }

  getTypeOfFood():Observable<FoodAndDrinkType[]> {
    const url=serverUrl + "food-and-drink-type/all";
    return this.http.get(url).map(res => res.json());
  }

  searchTags(keySearch: string): Observable<FoodAndDrink[]> {
    const url=serverUrl + "food-and-drink/search/tag";
    let params = new URLSearchParams();
    params.set('tag', keySearch);
    return this.http.get(url, {search: params}).map(res => res.json());
  }

  updateTableStatus(tableUpdate: any): Observable<any> {
    const url = serverUrl + "table/update-status";
    let headers = new Headers({'Content-Type': 'application/json'});
    let token = localStorage.getItem('token');
    headers.append("Authorization", token);
    return this.http.put(url, JSON.stringify(tableUpdate), {headers: headers});
  }

  private extractData(res: Response) {
        let body = res.json();
        return body.data || {};
  }

  public handleError(error: Response) {
    // console.error(error);
    if(error.status == 406) {
      alert("This table still doesn't pay yet");
    }
    return Observable.throw(error.json().error || 'Server error');
  }

}
