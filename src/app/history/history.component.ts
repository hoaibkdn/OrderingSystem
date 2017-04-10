import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

import { Invoice } from '../models/invoice';
import { InvoiceDetail } from '../models/invoice-detail';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HistoryComponent implements OnInit {
  invoices: Invoice[];
  invoiceDetail: InvoiceDetail[];
  constructor() {}

  ngOnInit() {}

}
