import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AdminService } from '../admin/admin.service';
import { Invoice } from '../models/invoice';
import { InvoiceDetail } from '../models/invoice-detail';
import { Table } from '../models/table';

@Component({
  selector: 'app-ad-ordering',
  templateUrl: './ad-ordering.component.html',
  styleUrls: ['./ad-ordering.component.scss']
})
export class AdOrderingComponent implements OnInit {
	tableId: number;
	unpaidInvoices: Invoice[];
	invoice: Invoice;
	invoiceDetails: InvoiceDetail[];
	totalMoney: number;
  invoiceDetail: InvoiceDetail;
  constructor(private route: ActivatedRoute, private adminService: AdminService) {
  	this.totalMoney = 0;
  }

  ngOnInit() {
    this.invoiceDetails = [];
    this.adminService.getAllUnpaidInvoice().subscribe(res => {
      this.unpaidInvoices = JSON.parse(res._body);
      this.route.data.subscribe((data: {tableId: number} ) => {
        this.invoice = null;
        this.tableId = data.tableId;
        console.log('$$$ id table ', this.tableId);
        console.log(this.unpaidInvoices.length);
        for (let i = 0; i < this.unpaidInvoices.length; i++){
          console.log(this.unpaidInvoices[i].table.id);
          if (this.unpaidInvoices[i].table.id == this.tableId){
            this.invoice = this.unpaidInvoices[i];
            break;
          }
        }
        if(this.invoice != null){
          this.totalMoney = 0;
          this.adminService.getInvoiceDetailForInvoice(this.invoice.id).subscribe(res => {
              this.invoiceDetails = JSON.parse(res._body);
              console.log(this.invoiceDetails);
              for(let i = 0; i < this.invoiceDetails.length; i++){
                console.log("Total: ", this.totalMoney);
                this.totalMoney += this.invoiceDetails[i].price * this.invoiceDetails[i].quantity;
              }
            }, err => {
              console.log(err);
            });
        } else {
          this.invoiceDetails = [];
          this.totalMoney = 0;
        }
      });
    });
  }

  changeClassToBeDone(){
    let table = document.getElementsByClassName('table-order__col ' + this.tableId)[0];
    if (!table.classList.contains('has-done')){
      this.adminService.setMadeForInvoice(this.invoice.id).subscribe(res => {
          console.log(res._body);
          table.classList.add('has-done');
          table.classList.remove('is-ordering');
          let btnDone = document.getElementsByClassName('btn-done')[0];
          console.log(this.invoice.id, " - ", this.invoice.table.id);
          console.log(table.classList.contains('has-done'));
        }, err => {
          console.log(err);
        }
      )
    }
       
  }
}
