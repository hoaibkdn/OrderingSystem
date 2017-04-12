import { Injectable, HostListener, Directive } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { Rating } from '../models/Rating';

@Injectable()
export class AdStatisticDrinkService {
  private drinkUrl = "http://backend-os.herokuapp.com/api/rate/1/num-of-people";
  // private drinkUrl = "http://localhost:3000/food";
  constructor(private http: Http) {}

  getRatingDrink(): Observable<Rating[]> {
    return this.http.get(this.drinkUrl)
    // return this.http.get(this.drinkUrl+"/1/num-of-people")
        .map(response => response.json())
        .catch(this.handleError);
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
