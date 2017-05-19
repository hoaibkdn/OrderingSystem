import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../admin/admin.service';
import { Table } from '../models/table';
import { Invoice } from '../models/invoice';
import { OrderTable } from '../models/order-table';
import { websocketUrl } from './../server-url.config';
import { AppService } from './../app.service';
import { ReservedTable } from './../models/reserved-table';

declare var Stomp: any;
declare var $:any;

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
  cancelTable: Table;
  orderTables: OrderTable[];
  stompAdmin: any;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private appService: AppService) {
    this.invoices = [];
    }

  ngOnInit() {
    this.getUnpaidInvoice();
    this.stompClient = Stomp.client(websocketUrl + "admin");
    this.stompClient.connect({}, (frame) => {
        console.log('Connected admin: ' + frame);
        console.log(this.stompClient);
        // Uncomment for heroku server
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
          if(messageOutput.body.includes("is ordering") || messageOutput.body.includes("has been paid") ||
          messageOutput.body.includes("has been cleaned") ){
            this.getUnpaidInvoice();
          }
          if(messageOutput.body.includes("is reserving")) {
            var tableNumber = messageOutput.body.split(' ')[8];
            console.log('tableNumber ', tableNumber);
            this.getRecentReservedTable(tableNumber);
          }
          if(messageOutput.body.includes("canceled")) {
            this.updateViewCancelReservedTable();
          }
        });
    });
  }

  detailTable(table: Table) {
    if(table.tableStatus === 4) {
      this.cancelTable = table;
      $('#cancelReservingTable').modal('show');
    }
    else {
      this.router.navigate([table.id], { relativeTo: this.route });
    }
  }

  cancelReserved(statusCancel: number) {
    var reservedTable = this.cancelTable;
    var cancelTableId;
    console.log("reservedTable local ", reservedTable);
    this.appService.getReservedTable()
      .subscribe(res => {
        res.forEach( (resTable, index) => {
          if(resTable.table.id === reservedTable.id) {
            cancelTableId = resTable.id;
          }
        });
        var objCancel = {
          "reservedTableId": cancelTableId+'',
          "detail": "",
          "finalStatus": statusCancel+""
        }
        console.log('admin cancel ', objCancel);

        this.appService.cancelReserved(objCancel)
          .subscribe(res => console.log("cancel ", res));
        localStorage.removeItem("timestartReserved");
        localStorage.setItem("countDownReserving", 'false');
        localStorage.removeItem('reservedTable');
        $('#cancelReservingTable').modal('hide');
        this.updateViewCancelReservedTable();
        // this.router.navigate(["/admin"]);
        // this.timeCountMinsReserve = 0;
        // this.timeCountSecsReserve = 0;
        // this.countDownReserving = false;
      })
  }

  getUnpaidInvoice(){
    this.adminService.getAllUnpaidInvoice().subscribe(res => {
      this.invoices = JSON.parse(res._body);
      this.getOrderOfTable();
    });
  }

  getOrderOfTable() {
    this.adminService.getAllTable().subscribe(res => {
        this.tables = JSON.parse(res._body);
        console.log("Tables: ", this.tables);
        this.setTableStatusOnView();
        // this.groupThreeTables = [];
        // var i = 0;
        // var temp = [];
        // for(let k = 0; k < this.tables.length; k++){
        //   temp.push(this.tables[k]);
        // }
        // let numOfTableFloat = this.tables.length / 3;
        // let numOfTableInt = Math.floor(this.tables.length / 3);
        // let numOfGroup = (numOfTableFloat > numOfTableInt) ? numOfTableInt + 1 : numOfTableInt;
        // for(let i = 0; i < numOfGroup; i++){
        //   var group = [];
        //   for (let l = 0; l < 3; l++){
        //     group.push(temp[l + i * 3]);
        //     if (l == 2){
        //       this.groupThreeTables.push(group);
        //     } else if((l + i * 3 + 1) == this.tables.length){
        //       this.groupThreeTables.push(group);
        //       break;
        //     }
        //   }
        // }
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

  updateViewCancelReservedTable() {
    this.adminService.getAllTable().subscribe(res => {
        this.tables = JSON.parse(res._body);
        this.setTableStatusOnView();
    });
  }

  setTableStatusOnView() {
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
  }

  getRecentReservedTable(tableNumber:number) {
    this.adminService.getAllTable().subscribe(res => {
      this.tables = JSON.parse(res._body);
      console.log("Tables: ", this.tables);
      this.setTableStatusOnView();

      // getTimeReserved
      this.appService.getReservedTable()
        .subscribe(res => {
          console.log('reserved table ', res);
          var recentTableReserved: ReservedTable;
          for(var i = 0; i < res.length; i++) {
            if(res[i].table.tableNumber == tableNumber) {
              recentTableReserved = res[i];
              break;
            }
          }
          var travelingTime = recentTableReserved.travelingTime;
          var reservingTime = recentTableReserved.reservingTime;
          console.log('reservingTime ', new Date(reservingTime).getMinutes(), ':', new Date(reservingTime).getSeconds());
          var currentTime = new Date().getTime();
          var spentTime = currentTime - reservingTime;
          var remainTime = travelingTime - spentTime;
          var remainTimeFormat = new Date(remainTime);
          console.log('remainTime ', remainTimeFormat.getMinutes(), ':', remainTimeFormat.getSeconds());

          if(remainTime > 0) {

          }
          this.countDownReserving(recentTableReserved.table);
        });
    });
  }
  countDownReserving(table: Table) {
    // table.countDown.minutes = 0;
    // table.countDown.seconds = 50;
    var startCount = setInterval(function() {
      // if(table.countDown.seconds > 0) {
      //   table.countDown.seconds--;
      //   if(table.countDown.seconds === 0) {
      //     table.countDown.minutes--;
      //     if(table.countDown.minutes === (-1)) {
      //       clearInterval(startCount);
      //     }
      //   }
      // }
      table.size--;
      console.log('table size ', table.size);

    }, 1000)
  }
}
