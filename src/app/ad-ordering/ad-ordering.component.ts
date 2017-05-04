import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AdminService } from '../admin/admin.service';
import { Invoice } from '../models/invoice';
import { InvoiceDetail } from '../models/invoice-detail';
import { Table } from '../models/table';

declare var Stomp: any;

@Component({
  selector: 'app-ad-ordering',
  templateUrl: './ad-ordering.component.html',
  styleUrls: ['./ad-ordering.component.scss']
})
export class AdOrderingComponent implements OnInit {
	tableNumber: number;
	unpaidInvoices: Invoice[];
	invoice: Invoice;
	invoiceDetails: InvoiceDetail[];
	totalMoney: number;
  invoiceDetail: InvoiceDetail;
  stompClient: any;
  constructor(private route: ActivatedRoute, private adminService: AdminService) {
  	this.totalMoney = 0;
  }

  ngOnInit() {
    this.getAllInvoiceDetails();
    this.stompClient = Stomp.client("wss://backend-os-v2.herokuapp.com/admin");
    this.stompClient.connect({}, (frame) => {
        console.log('Connected admin: ' + frame);
        console.log(this.stompClient);
        setInterval(() => {
            if(!this.stompClient.connected){
              console.log("Failed to connect");
            } else {
              console.log("Interval at " + new Date());
              this.stompClient.send("/app/admin", {}, "");
            }
          }, 30000);
        this.stompClient.subscribe('/request/admin', (messageOutput) => {
          var tag = document.getElementsByClassName('chat-box')[0];
          console.log("Received message: ", messageOutput.body);
          if(messageOutput.body.includes("is ordering")  || messageOutput.body.includes("has been paid")){
            this.getAllInvoiceDetails();
          }
        });
    });

  }

  getAllInvoiceDetails(){
    this.invoiceDetails = [];
    this.adminService.getAllUnpaidInvoice().subscribe(res => {
      this.unpaidInvoices = JSON.parse(res._body);
      console.log("Unpaid invoice: ", this.unpaidInvoices);
      this.route.data.subscribe((data: {tableId: number} ) => {
        this.invoice = null;
        this.tableNumber = data.tableId;
        console.log('$$$ id table ', this.tableNumber);
        for (let i = 0; i < this.unpaidInvoices.length; i++){
          if (this.unpaidInvoices[i].table.tableNumber == this.tableNumber){
            this.invoice = this.unpaidInvoices[i];
            console.log("Invoice: ", this.invoice);
            break;
          }
        }
        if(this.invoice != null){
          this.totalMoney = 0;
          this.adminService.getInvoiceDetailForInvoice(this.invoice.id).subscribe(res => {
              this.invoiceDetails = JSON.parse(res._body);
              for(let i = 0; i < this.invoiceDetails.length; i++){
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
    let table = document.getElementsByClassName('table-order__col ' + this.tableNumber)[0];
    if (!table.classList.contains('has-done')){
      this.adminService.setMadeForInvoice(this.invoice.id).subscribe(res => {
          console.log(res._body);
          table.classList.add('has-done');
          table.classList.remove('is-ordering');
          let btnDone = document.getElementsByClassName('btn-done')[0];
          console.log(this.invoice.id, " - ", this.invoice.table.tableNumber);
          console.log(table.classList.contains('has-done'));
          this.stompClient.send("/app/admin", {}, "Admin notification - Food and drink for table " + this.tableNumber + " is ready");
        }, err => {
          console.log(err);
        }
      )
    }
  }
}
