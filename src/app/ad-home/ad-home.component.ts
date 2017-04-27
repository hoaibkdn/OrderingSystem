import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../admin/admin.service';
import { Table } from '../models/table';
import { Invoice } from '../models/invoice';

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
  orderOfTable: any;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private route: ActivatedRoute) {
    this.invoices = [];
    this.orderOfTable = [];
    }

  ngOnInit() {
    this.getUnpaidInvoice();
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
          if(messageOutput.body.includes("is ordering")){
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
        // let invoiceList = this.invoices;
        // for( let i = 0; i < this.tables.length; i++){
        //   for (let k = 0; k < invoiceList.length; k++){
        //     if (invoiceList[k].table.id == this.tables[i].id){
        //       this.invoices.push(invoiceList[k]);
        //     } else {
        //       this.invoices.push();
        //     }
        //   }
        // }
        console.log("Tables: ", this.tables);
        this.groupThreeTables = [];
        var i = 0;
        var temp = [];
        for(let k = 0; k < this.tables.length; k++){
          temp.push(this.tables[k]);
        }
        let numOfGroup = Math.floor(this.tables.length / 3) + 1;
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
        this.orderOfTable = [];
        for (let i = 0; i < this.tables.length; i++){
          let isNull = true;
          for (let k = 0; k < this.invoices.length; k++){
              if(this.invoices[k] != null && this.invoices[k].table.id == i + 1){
                console.log("Invoice ", this.invoices[k], " table: ", i + 1);
                invoiceList.push(this.invoices[k]);
                isNull = false;
                break;
              }
          }
          if(isNull){
            console.log("No find");
            invoiceList.push(null);
            console.log("No find: ", invoiceList);
          }
        }
        invoiceList.sort(function(invoice1: Invoice, invoice2:Invoice) {
          if (invoice1 != null && invoice2 != null){
            return (parseInt(invoice1.createdDate + "") - parseInt(invoice2.createdDate + ""));
          } else {
            return 0;
          }
        });
        // this.invoices = invoiceList;
        // for (let l = 0; l < this.invoices.length; l++){
        //   if(this.invoices[l] != null){
        //     console.log("Invoice List: " + this.invoices[l].table.id, " is made " + this.invoices[l].made);
        //   } else {
        //     console.log(null);
        //   }
        // }
        this.invoices = [];
        for (let m = 0; m < invoiceList.length; m++){
          this.invoices.push(invoiceList[m]);
        }
        this.invoices.sort(function(invoice1: Invoice, invoice2:Invoice) {
          if (invoice1 != null && invoice2 != null){
            return (parseInt(invoice1.table.id + "") - parseInt(invoice2.table.id + ""));
          } else {
            return 0;
          }
        })
        let order = 1;
        for (let k = 1; k <= invoiceList.length; k++){
          if (invoiceList[k - 1] != null){
            let data = {order: "" + order, tableId: invoiceList[k-1].table.id + ""};
            this.orderOfTable.push(data);
            order++;
          } else {
            let data = {order: "", tableId: "0"};
            this.orderOfTable.push(null);
          }
        }
        this.orderOfTable.sort((a, b) =>{
          if (a != null && b != null){
            return parseInt(a["tableId"]) - parseInt(b["tableId"]);
          } else {
            return 0;
          }
          
        })
        console.log("Order of table: ", this.orderOfTable);
      }, err => {
      console.log(err);
    });
  }

  // getOrderingNumberOfTable(tableId: any){
  //   for(let i = 0; i < this.orderOfTable.length; i++){
  //     if(this.orderOfTable[i]["tableId"] == tableId + ""){
  //       return this.orderOfTable[i]["order"];
  //     }
  //   }
  // }
}
