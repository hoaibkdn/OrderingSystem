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
  invoiceDetails: InvoiceDetail[];
  sortBy = "id";
  // invoiceId: number;
  // @Input() id: number;
  constructor(
    private historyInvoiceService: HistoryInvoiceService
  ) { }

  ngOnInit() {
    this.historyInvoiceService.getAllInvoice()
      .subscribe(invoices => {this.invoices = invoices; console.log('all invoice: ', this.invoices);
      });
  }

  getInvoiceDetail(id: string) {
    console.log('id detail ', id);

    this.historyInvoiceService.getInvoiceDetail(id)
      .subscribe(invoiceDetails => {this.invoiceDetails = invoiceDetails;
        console.log('invoice detail ', this.invoiceDetails);
      });
  }
}
