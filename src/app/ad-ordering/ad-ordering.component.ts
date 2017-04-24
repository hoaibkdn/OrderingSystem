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
    console.log('id ', this.route.params['_value']['id']);
    this.tableId = this.route.params['_value']['id'];
    this.route.data
        .subscribe((data: {table: Table})=> {
          console.log('$$$ data ', data);
          // this.invoiceDetail = data.invoiceDetail;
          this.adminService.getAllUnpaidInvoice().subscribe(res => {
            this.unpaidInvoices = JSON.parse(res._body);
            for (let i = 0; i < this.unpaidInvoices.length; i++){
              if (this.unpaidInvoices[i].table.id == this.tableId){
                console.log('$$$ id table ', this.tableId);
                this.invoice = this.unpaidInvoices[i];
                break;
              }
            }
            if(this.invoice != null){
              this.adminService.getInvoiceDetailForInvoice(this.invoice.id).subscribe(res => {
                  this.invoiceDetails = JSON.parse(res._body);
                  for(let i = 0; i < this.invoiceDetails.length; i++){
                    this.totalMoney += this.invoiceDetails[i].price * this.invoiceDetails[i].quantity;
                  }
                  console.log('$$$ here 0 ', this.invoiceDetails[0]);
                  console.log('$$$ here 1 ', this.invoiceDetails[1]);
                  console.log('$$$ here 2 ', this.invoiceDetails[2]);
                }, err => {
                  console.log(err);
                });
            }
          }, err => {
            console.log(err);
          })
        })
    this.adminService.getAllUnpaidInvoice().subscribe(res => {
    	this.unpaidInvoices = JSON.parse(res._body);
    	for (let i = 0; i < this.unpaidInvoices.length; i++){
    		if (this.unpaidInvoices[i].table.id == this.tableId){
    			this.invoice = this.unpaidInvoices[i];
    			break;
    		}
    	}
    	if(this.invoice != null){
    		this.adminService.getInvoiceDetailForInvoice(this.invoice.id).subscribe(res => {
    				this.invoiceDetails = JSON.parse(res._body);
    				for(let i = 0; i < this.invoiceDetails.length; i++){
    					this.totalMoney += this.invoiceDetails[i].price * this.invoiceDetails[i].quantity;
    				}
    			}, err => {
    				console.log(err);
    			});
    	}
    }, err => {
    	console.log(err);
    })
  }



}
