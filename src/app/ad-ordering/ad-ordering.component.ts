import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AdminService } from '../admin/admin.service';
import { MenuService } from '../menu/menu.services';
import { Invoice } from '../models/invoice';
import { InvoiceDetail } from '../models/invoice-detail';
import { Table } from '../models/table';
import { ReservedTable } from '../models/reserved-table';
import { User } from '../models/user';
import { websocketUrl } from './../server-url.config'

declare var Stomp: any;
declare var $:any;

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
  reservedTable: ReservedTable;
  // user: User;
  constructor(private route: ActivatedRoute, private adminService: AdminService, private menuService: MenuService) {
  	this.totalMoney = 0;
  }

  ngOnInit() {
    this.getAllInvoiceDetails();
    this.stompClient = Stomp.client(websocketUrl + "admin");
    this.stompClient.connect({}, (frame) => {
        console.log('Connected admin: ' + frame);
        console.log(this.stompClient);
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
          if(messageOutput.body.includes("is ordering")  || messageOutput.body.includes("has been paid")){
            this.getAllInvoiceDetails();
          }
        });
    });

  }

  getReservedTable(){
    this.adminService.getReservedTable().subscribe(res => {
      let allReservedTable: ReservedTable[] = res;
      for (let i = 0; i < allReservedTable.length; i++){
        if(allReservedTable[i].table.tableNumber == this.tableNumber){
          this.reservedTable = allReservedTable[i];
          console.log(this.reservedTable);
          break;
        }
      }
      // this.adminService.getUserInfo(this.reservedTable.user.id).subscribe(res => {
      //   this.user = res;
      //   console.log(this.user);
      // }, err => {
      //   console.log(err);
      // })
    }, err => {
      console.log(err);
    })
  }

  getAllInvoiceDetails(){
    this.invoiceDetails = [];
    this.adminService.getAllUnpaidInvoice().subscribe(res => {
      this.unpaidInvoices = JSON.parse(res._body);
      console.log("Unpaid invoice: ", this.unpaidInvoices);
      this.route.data.subscribe((data: {tableNumber: number} ) => {
        this.invoice = null;
        this.reservedTable = null;
        this.tableNumber = data.tableNumber;
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
          this.getReservedTable();
        }
      });
    });
  }

  displayCancelOrder(){
    $('#cancelOrderingRequest').modal('show');
  }

  cancelOrder(){
    if (this.invoice != null){
      this.adminService.deleteInvoice(this.invoice.id).subscribe(res => {
        console.log(res);
        if(res.status == 200){
          var updateTable = {
            "tableId": this.invoice.table.id+"",
            "statusNumber":"0"
          }  
          this.menuService.updateTableStatus(updateTable).subscribe(res => {
            console.log(res);
            this.stompClient.send("/app/admin", {},"Invoice " +this.invoice.id + ": Ordering request has been canceled by ad1min");
            this.getAllInvoiceDetails();
          }, err => {
            console.log(err);
          })
          
          $('#cancelOrderingRequest').modal('hide');
        } else {
          alert("Can't delete ordering request due to errors. Please try again");
        }
      }, err => {
        console.log(err);
        alert("Can't delete ordering request due to errors. Please try again");
      })
    }
  }

  changeClassToBeDone(){
    let table = document.getElementsByClassName('table-order__col ' + this.tableNumber)[0];
    if (!table.classList.contains('has-done')){
      this.adminService.setMadeForInvoice(this.invoice.id).subscribe(res => {
          console.log(res._body);
          table.classList.add('is-food-made');
          table.classList.remove('is-ordering');
          let btnDone = document.getElementsByClassName('btn-done')[0];
          console.log(this.invoice.id, " - ", this.invoice.table.tableNumber);
          console.log(table.classList.contains('is-food-made'));
          this.stompClient.send("/app/admin", {}, "Admin notification - Food and drink for table " + this.tableNumber + " is ready");
          this.getAllInvoiceDetails();
        }, err => {
          console.log(err);
        }
      )
    }
  }

  displayCancel(){
    $('#cancelReservingTable').modal('show');
  }

  sendCancelReserveToClient(table: Table) {
    console.log("choosed table cancel ", table);
    this.stompClient.send("/app/admin", {},"Table " +table.id + " is canceled by admin");
  }

  // cancelReserved(statusCancel: number, numOfTable: number) {
  //   // console.log('this.cancelTable ', this.cancelTable);
  //   // var cancelTableId;
  //   // var cancelTable: Table;
  //   // if(this.cancelTable) {
  //   //   cancelTable = this.cancelTable;
  //   // }
  //   // this.appService.getReservedTable()
  //   //   .subscribe(res => {
  //   //     console.log('all reserved table ', res);

  //   //     for(var i = 0; i < res.length; i++) {
  //   //       if((this.cancelTable && (res[i].table.tableNumber == cancelTable.tableNumber))||
  //   //         (!this.cancelTable && (res[i].table.tableNumber == numOfTable))) {
  //   //         cancelTableId = res[i].id;
  //   //       }
  //   //     }
  //   //     var objCancel = {
  //   //       "reservedTableId": cancelTableId+'',
  //   //       "detail": "",
  //   //       "finalStatus": statusCancel+""
  //   //     }
  //   //     console.log('admin cancel ', objCancel);

  //   //     this.appService.cancelReserved(objCancel)
  //   //       .subscribe(res => {
  //   //         console.log("cancel ", res);
  //   //         if (res.status == 200){
  //   //           localStorage.removeItem("timestartReserved");
  //   //           localStorage.setItem("countDownReserving", 'false');
  //   //           // localStorage.removeItem('reservedTable');
  //   //           $('#cancelReservingTable').modal('hide');
  //   //           this.tablesCountDownMins[numOfTable-1] = 0;
  //   //           this.tablesCountDownSecs[numOfTable-1] = 0;
  //   //           this.updateViewCancelReservedTable();
  //   //           this.cancelTable = null;
  //   //           this.sendCancelReserveToClient(cancelTable);
  //   //         }
  //   //       },
  //   //       err => {
  //   //         console.log(err);
  //   //       });
        
  //   //   })
  // }
}
