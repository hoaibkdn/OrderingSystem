import { Injectable }             from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AdminService } from '../admin/admin.service';
import { Table } from '../models/table';
import { Invoice } from '../models/invoice';
import { InvoiceDetail } from '../models/invoice-detail';

@Injectable()
export class AdOrderingResolve implements Resolve<number> {
    table: Table;
    unpaidInvoices: Invoice[];
  constructor(
    private router: Router,
    private adminService: AdminService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<number> {
    let id = route.params['id'];
    console.log("id "+id);
    return id;
  };
}
