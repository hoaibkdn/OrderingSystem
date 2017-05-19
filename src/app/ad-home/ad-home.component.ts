import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../admin/admin.service';
import { Table } from '../models/table';
import { Invoice } from '../models/invoice';
import { OrderTable } from '../models/order-table';
import { websocketUrl } from './../server-url.config';

declare var Stomp: any;

@Component({
  selector: 'app-ad-home',
  templateUrl: './ad-home.component.html',
  styleUrls: ['./ad-home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdHomeComponent implements OnInit {
  tables:Table[];
  groupThreeTables: any;
  invoices: Invoice[];
  stompClient: any;
  orderTables: OrderTable[];

  constructor(
    private router: Router,
    private adminService: AdminService,
    private route: ActivatedRoute) {
    this.invoices = [];
    }

  ngOnInit() {
    this.getUnpaidInvoice();
    this.stompClient = Stomp.client(websocketUrl + "admin");
    this.stompClient.connect({}, (frame) => {
        console.log('Connected admin: ' + frame);
        console.log(this.stompClient);
        // Uncomment for heroku server
        // setInterval(() => {
        //     if(!this.stompClient.connected){
        //       console.log("Failed to connect");
        //     } else {
        //       console.log("Interval at " + new Date());
        //       this.stompClient.send("/app/admin", {}, "");
        //     }
        //   }, 30000);
        this.stompClient.subscribe('/request/admin', (messageOutput) => {
          var tag = document.getElementsByClassName('chat-box')[0];
          console.log("Received message: ", messageOutput.body);
          if(messageOutput.body.includes("is ordering") || messageOutput.body.includes("has been paid") || messageOutput.body.includes("has been cleaned")){
            this.getUnpaidInvoice();
          }
        });
    });    
  }

  detailTable(id: number) {
    this.router.navigate([id], { relativeTo: this.route });
  }

  getUnpaidInvoice(){
    this.adminService.getAllUnpaidInvoice().subscribe(res => {
      this.invoices = JSON.parse(res._body);
      this.getOrderOfTable();
    });
  }

  getOrderOfTable(){
    this.adminService.getAllTable().subscribe(res => {
        this.tables = JSON.parse(res._body);
        console.log("Tables: ", this.tables);
        this.groupThreeTables = [];
        var i = 0;
        var temp = [];
        for(let k = 0; k < this.tables.length; k++){
          temp.push(this.tables[k]);
        }
        let numOfTableFloat = this.tables.length / 3;
        let numOfTableInt = Math.floor(this.tables.length / 3);
        let numOfGroup = (numOfTableFloat > numOfTableInt) ? numOfTableInt + 1 : numOfTableInt;
        for(let i = 0; i < numOfGroup; i++){
          var group = [];
          for (let l = 0; l < 3; l++){
            group.push(temp[l + i * 3]);
            if (l == 2){
              this.groupThreeTables.push(group);
            } else if((l + i * 3 + 1) == this.tables.length){
              this.groupThreeTables.push(group);
              break;
            }
          }
        }
        let invoiceList: Invoice[] = [];
        for (let i = 0; i < this.invoices.length; i++){
          console.log(this.invoices[i]);
          invoiceList.push(this.invoices[i]);
          console.log("Sorted: ", invoiceList);
        }
        invoiceList.sort(function(invoice1: Invoice, invoice2: Invoice) {
          console.log(1);
          return (parseInt(invoice1.createdDate + "") - parseInt(invoice2.createdDate + ""));
        });
        console.log("Sorted: ", invoiceList);
        this.orderTables = [];
        for(let i = 0; i < this.tables.length; i++){
          let orderTable = new OrderTable(this.tables[i].tableNumber, 0);
          this.orderTables.push(orderTable);
        }
        console.log("Order tables: ", this.orderTables);
        let numberOrder = 1;
        for(let i = 0; i < invoiceList.length; i++){
          for (let k = 0; k < this.tables.length; k++){
            if(invoiceList[i].table.tableNumber === this.tables[k].tableNumber){
              this.orderTables[k].numOrder = numberOrder;
              numberOrder++;
              break;
            }
          }
        }
      }, err => {
      console.log(err);
    });
  }
}
