import { Injectable, HostListener, Directive } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { FoodAndDrink } from '../models/food-and-drink';
import { Rating } from '../models/Rating';


@Injectable()
export class MenuService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private foodUrl = "http://192.168.0.106:8080/api/food-and-drink/all";
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
  getRate(type: string, id: number): Observable<Rating> {
    this.rateUrl = "http://localhost:3000/"+type+"/"+id;
    console.log("url "+ this.rateUrl);

    return this.http.get(this.rateUrl)
        .map(response => response.json() as Rating);
  }

  updateRate(type:string, rating: Rating): Promise<Rating> {
    var rateUrl;
    if(type === "food") rateUrl = "http://localhost:3000/food/"+rating.id;
    else if(type === "service") rateUrl = "http://localhost:3000/service/"+rating.id;
    return this.http.put(rateUrl, JSON.stringify(rating), {headers: this.headers})
          .toPromise()
          .then(() => rating);
  }


  postOrder(order: any): Observable<any>{
    const url = "http://192.168.0.106:8080/api/invoice";
    this.headers.append('Authorization', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJiaWdlckBnbWFpbC5jb20iLCJhdWRpZW5jZSI6IndlYiIsImNyZWF0ZWQiOjE0OTEwNDA4NjAwNDYsImV4cCI6MTQ5MTEyNzI2MH0.Nwjc8Xzs72keWEbxc4YD4XJML7jmKLDB_Yf-XAjbJzGyFN7NpnMKBox02GllGaNL9DJw1jJIf5F02QjPFZiegQ');
    return this.http.post(url, order, {headers: this.headers});
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
