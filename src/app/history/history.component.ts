import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { UserProfileService } from '../user-profile/user-profile.service';

import { Invoice } from '../models/invoice';
import { InvoiceDetail } from '../models/invoice-detail';
import { User } from './../models/user';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HistoryComponent implements OnInit {
  invoices: Invoice[];
  invoiceDetail: InvoiceDetail[];
  membershipPoint: number;
  constructor(
    private userProfileService: UserProfileService
  ) {}

  ngOnInit() {
    this.getMembershipPoint();
  }

  getMembershipPoint() {
    this.userProfileService.getInfo()
      .subscribe(res => {
        this.membershipPoint = res.membershipPoint;
        console.log('membershipPoint ', this.membershipPoint);
      })
  }
}
