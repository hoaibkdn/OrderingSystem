import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileService } from '../user-profile/user-profile.service';
import { AdminService } from './../admin/admin.service';
import { MenuService } from './../menu/menu.services';
import { Table } from './../models/table';
import { Invoice } from './../models/invoice';
import { Payment } from '../models/payment';
import { WorkingTime } from '../models/working-time';
declare var Stomp: any;
declare var $:any;

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StaffComponent implements OnInit {

  message: any;
	stompClient: any;
  stompClient1: any;
	socket: any;
	date: Date;
	permissionList: string;
  userInfo: any;
  audio: any;
  hasMessage: boolean;
  callPayment: boolean;
  allTable: Table[];
  invoices: Invoice[];
  isPayed: boolean;
  isChecked: boolean;
  lastWorkingTime: WorkingTime;
  allWorkingTime: WorkingTime[];
  constructor(
    private userProfileService: UserProfileService,
    private adminService: AdminService,
    private menuService: MenuService,
    private router: Router) {
    this.audio = new Audio();
    this.audio.src = "/assets/music/demonstrative.mp3";
  }

  ngOnInit() {
    this.isChecked = true;
    if(this.isLogInInShift() > 0){
      this.adminService.getLastWorkingTime().subscribe(res => {
        if (res.status == 200){
          this.lastWorkingTime = JSON.parse(res._body);
          console.log("Last working time: ", this.lastWorkingTime);
          if(this.isCheckedInShift()){
            this.isChecked = true;
          } else {
            this.isChecked = false;
          }
        } else {
          this.lastWorkingTime = null;
          this.isChecked = false;
        }
        console.log("Is checked attendance: ", this.isChecked);
      }, err => {
        console.log(err);
      });
    } else {
      this.isChecked = true;
      console.log("Is checked attendance: ", this.isChecked);
    }
    this.music("off",this.audio);
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    let allMessage = localStorage.getItem('allMessage') == null ? "" : localStorage.getItem('allMessage');
    console.log("All message", allMessage);
    if (allMessage.includes("?")){
      // this.hasMessage = true;
      let listMessage = allMessage.split('?');
      for (var i = 1; i < listMessage.length; i++) {
      this.addMessage(listMessage[i]);
      }
    }

    this.stompClient = Stomp.client("wss://backend-os-v2.herokuapp.com/admin");
    this.stompClient.connect({}, (frame) => {
                    console.log('Connected: ' + frame);
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
                      let allMessage = localStorage.getItem('allMessage') == null ? "" : localStorage.getItem('allMessage');
                      localStorage.setItem('allMessage', allMessage + "?" + messageOutput.body);
                      console.log("Received message: ", messageOutput.body);
                      if(messageOutput.body.includes("needing some help") || messageOutput.body.includes("ready") || messageOutput.body.includes("requesting payment")){
                        this.hasMessage = true;
                        this.music("on", this.audio);
                      } else if(messageOutput.body.includes("accept request")){
                        this.hasMessage = false;
                      } else if(messageOutput.body.includes("payment")){
                        this.hasMessage = true;
                        this.callPayment = true;
                      }
                      this.message = messageOutput.body;
                      this.addMessage(messageOutput.body);
                    });
                });
    setTimeout(() => {
      if(this.userInfo != null && !allMessage.includes("available")){
        this.stompClient.send("/app/admin", {}, this.userInfo.name + " is available.");
        }
      }, 5000);
	};

	sendMessageAdmin(): void {
		if (this.message != null && (this.message.includes("is needing some help") || this.message.includes("ready") || this.message.includes("payment"))){
      this.stompClient.send("/app/admin", {}, this.userInfo.name + " accept request at " + this.message.split("-")[0].trim());
      this.hasMessage = false;
      this.music("off", this.audio);
      console.log(this.hasMessage);
    }
	};

	addMessage(message: string) {
	  let ul = document.getElementsByClassName("message")[0];
    console.log("UL tag for messages: ", ul);
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(message));
    ul.appendChild(li);
	}

  music(type, audio) {
    switch (type) {
      case "on": {
        audio.load();
        audio.play();
        break;
      }
      case "off": {
        audio.pause();
        console.log('turn off music');
        break;
      }
    }
  }

  getAllTableUnpay() {
    this.allTable = [];
    this.adminService.getAllUnpaidInvoice()
      .map(res => res.json())
      .subscribe(res => {
        this.invoices = res;
      });
  }

  confirmPayment(invoice: Invoice, paymentType: string) {
    // Quang: get paymentType
    var payment = new Payment;
    payment.invoiceId = invoice.id.toString();
    payment.paymentType = paymentType.toUpperCase();
    console.log("Payment: ", payment);
    this.menuService.paymentRequest(payment)
      .subscribe(res => {
        console.log(res);
        if(res.status == 201){
          this.stompClient.send("/app/admin", {}, "InvoiceID: " + payment.invoiceId + " has been paid. Confirmed by: " + this.userInfo.name + ".");
          $('#tableUnpay').modal('hide');
          this.isPayed = res;
          console.log("pay ", this.isPayed );
          localStorage.removeItem("invoiceId");
        }
      },
        err => {console.log(err)});
  }

  isCheckedInShift(){
    let lastCheckDate = new Date(this.lastWorkingTime.date);
    console.log("Last checked date: ", lastCheckDate);
    let today = new Date();
    if(today.getDate() == lastCheckDate.getDate() 
      && today.getMonth() == lastCheckDate.getMonth()
      && today.getFullYear() == lastCheckDate.getFullYear()
      && today.getHours() == lastCheckDate.getHours()){
      return true;
    } else {
      return false;
    }
  }

  isLogInInShift(){
    let date = new Date();
    if (date.getMinutes() >= 30 && date.getMinutes() <= 59){
      if (date.getHours() == 6){
        return 1;
      } else if (date.getHours() == 11){
        return 2;
      } else if (date.getHours() == 16){
        return 3;
      }
    }
    return 0;
  }

  checkAttendance(){
    if(!this.isChecked){
      let date = new Date();
      let body = {userId: "0", shiftId: "" + this.isLogInInShift(), date: "" + date.getTime()};
      console.log(body);
      this.adminService.createWorkingTime(body).subscribe(res => {
        console.log(res);
        if(res.status == 201){
          localStorage.setItem('staffCheckedAttendance', true + '');
          alert("Checked attendance successfully!");
          window.location.reload();
        } else {
          alert("You can't check attendance due to being late or not at the time to do!");
          this.router.navigate['/staff'];
        }
      }, err => {
        console.log(err);
      })
    }
    
  }
}
