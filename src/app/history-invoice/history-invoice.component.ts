import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation, Input } from '@angular/core';
import { Invoice } from '../models/invoice';
import { HistoryInvoiceService } from './history-invoice.service';
import { InvoiceDetail } from '../models/invoice-detail';

@Component({
  selector: 'app-history-invoice',
  templateUrl: './history-invoice.component.html',
  styleUrls: ['./history-invoice.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HistoryInvoiceComponent implements OnInit {
  invoices: Invoice[];
  invoiceDetail: InvoiceDetail;
  // invoiceId: number;
  // @Input() id: number;
  constructor(
    private historyInvoiceService: HistoryInvoiceService
  ) { }

  ngOnInit() {
    this.historyInvoiceService.getAllInvoice()
    // console.log('xxx ', this.historyInvoiceService.getAllInvoice());

      .subscribe(invoices => {this.invoices = invoices; console.log('all invoice: ', this.invoices);
      });
  }

  getInvoiceDetail(id: number) {
    console.log('id detail ', id);

    this.historyInvoiceService.getInvoiceDetail(id)
      .subscribe(invoiceDetail => {this.invoiceDetail = invoiceDetail;
        console.log('invoice detail ', this.invoiceDetail[0]);
      });
  }
}
