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
  tablesCountDownMins: number[] = [];
  tablesCountDownSecs: number[] = [];

  constructor(
    private router: Router,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private appService: AppService) {
    this.invoices = [];
    this.initTimeReserved();
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
    this.showAllReservedTable();
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

  cancelReserved(statusCancel: number, numOfTable: number) {
    console.log('this.cancelTable ', this.cancelTable);
    var cancelTableId;
    var cancelTable: Table;
    if(this.cancelTable) {
      cancelTable = this.cancelTable;
    }
    this.appService.getReservedTable()
      .subscribe(res => {
        console.log('all reserved table ', res);

        for(var i = 0; i < res.length; i++) {
          if((this.cancelTable && (res[i].table.tableNumber == cancelTable.tableNumber))||
            (!this.cancelTable && (res[i].table.tableNumber == numOfTable))) {
            cancelTableId = res[i].id;
          }
        }
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
        // localStorage.removeItem('reservedTable');
        $('#cancelReservingTable').modal('hide');
        this.tablesCountDownMins[numOfTable-1] = 0;
        this.tablesCountDownSecs[numOfTable-1] = 0;
        this.updateViewCancelReservedTable();
        this.cancelTable = null;
        this.sendCancelReserveToClient(cancelTable);
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

  showAllReservedTable() {
    this.appService.getReservedTable()
      .subscribe(reservedTables => {
        var self = this;
        reservedTables.forEach((resevedTable, index) => {
          self.getRecentReservedTable(resevedTable.table.tableNumber);
        })
      });
  }

  initTimeReserved() {
    this.adminService.getAllTable().subscribe(res => {
      this.tables = JSON.parse(res._body);
      var self = this;
      this.tables.forEach((table, index) => {
        self.tablesCountDownMins.push(0);
        self.tablesCountDownSecs.push(0);
      });
    });
  }

  updateViewCancelReservedTable() {
    this.adminService.getAllTable().subscribe(res => {
        this.tables = JSON.parse(res._body);
        this.getOrderOfTable();
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
          console.log('reservingTime ', reservingTime);
          var currentTime = new Date().getTime();
          console.log('currentTime ', currentTime);

          if(reservingTime >= currentTime) {
            this.countDownReserving(tableNumber, travelingTime-1, 59);
          }
          else {
            var spentTime = currentTime - reservingTime;
            console.log('spentTime ', new Date(spentTime));
            var spentTimeMins = new Date(spentTime).getMinutes();
            var spentTimeSecs = new Date(spentTime).getSeconds();
            if((spentTimeMins > travelingTime) ||
              (spentTimeMins == travelingTime && spentTimeSecs > 0) ) {
              this.cancelReserved(13, tableNumber);
            }
            else {
              var remainMins = travelingTime - spentTimeMins - 1;
              var remainSecs = 60 - spentTimeSecs;
              this.countDownReserving(tableNumber, remainMins, remainSecs);
            }
          }
        });
    });
  }
  countDownReserving(tableNumber: number, mins: number, secs: number) {
    console.log('cownt down ', this.tablesCountDownMins);
    var self = this;
    this.tablesCountDownMins[tableNumber-1] = mins;
    this.tablesCountDownSecs[tableNumber-1] = secs;
    var startCount = setInterval(function() {
      if(self.tablesCountDownSecs[tableNumber-1] > 0) {
        self.tablesCountDownSecs[tableNumber-1]--;
        if(self.tablesCountDownSecs[tableNumber-1] === 0) {
          self.tablesCountDownMins[tableNumber-1]--;
          self.tablesCountDownSecs[tableNumber-1] = 59;
          if(self.tablesCountDownMins[tableNumber-1] === (-1)) {
            // self.cancelReserved(13, tableNumber);
            self.updateViewCancelReservedTable();
            self.tablesCountDownMins[tableNumber-1] = 0;
            self.tablesCountDownSecs[tableNumber-1] = 0;
            clearInterval(startCount);
          }
        }
      }
    }, 1000);
  }

  sendCancelReserveToClient(table: Table) {
    console.log("choosed table cancel ", table);
    this.stompClient.send("/app/admin", {},"Table " +table.id + " is canceled by admin");
  }
}
