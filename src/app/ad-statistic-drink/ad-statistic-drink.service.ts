import { Injectable, HostListener, Directive } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { Rating } from '../models/Rating';
import { RatingGet } from './../models/rating-get';

@Injectable()
export class AdStatisticDrinkService {
  private drinkUrl = "https://backend-os-v2.herokuapp.com/api/rate/1/num-of-people";
  private serviceUrl = "https://backend-os-v2.herokuapp.com/api/rate/2/num-of-people";
  // private drinkUrl = "http://localhost:3000/food";
  constructor(private http: Http) {}

  getRatingDrink(): Observable<Rating[]> {
    return this.http.get(this.drinkUrl)
        .map(response => response.json())
        .catch(this.handleError);
  }

  getRatingService(): Observable<Rating[]> {
    return this.http.get(this.serviceUrl)
        .map(response => response.json())
        .catch(this.handleError);
  }

  getDetailRating(): Observable<RatingGet[]> {
    var url = "https://backend-os-v2.herokuapp.com/api/rate/all-rates";
    return this.http.get(url).map(res => res.json());
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
