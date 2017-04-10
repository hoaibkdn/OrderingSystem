import { Component, OnInit, ElementRef } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { InvoiceDetail } from './../models/invoice-detail';
import { UserHistoryService } from './user-history.service';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserHistoryComponent implements OnInit {
  invoiceDetails: InvoiceDetail[];
  constructor(
    private elr: ElementRef,
    private userHistoryService: UserHistoryService
  ) { }

  ngOnInit() {
    console.log('header ');

    this.userHistoryService.getAllDetail()
      .subscribe(res => this.invoiceDetails = res);
  }

  // showTotal() {
  //   var quantity[]
  // }
}
