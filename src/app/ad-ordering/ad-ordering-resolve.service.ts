import { Injectable }             from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class AdOrderingResolve implements Resolve<number> {
  constructor(
    private router: Router,
    private adminService: AdminService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<number> {
    let number = route.params['number'];
    console.log("number "+number);
    return number;
  };
}
