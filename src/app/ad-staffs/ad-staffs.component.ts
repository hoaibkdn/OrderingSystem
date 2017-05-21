import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { UserProfileService } from '../user-profile/user-profile.service';
import { AdminService } from './../admin/admin.service';
import { MenuService } from './../menu/menu.services';
import { Table } from './../models/table';
import { Invoice } from './../models/invoice';
import { Payment } from '../models/payment';
import { websocketUrl } from '../server-url.config'

declare var Stomp: any;
declare var $:any;

@Component({
  selector: 'app-ad-staffs',
  templateUrl: './ad-staffs.component.html',
  styleUrls: ['./ad-staffs.component.scss']
})
export class AdStaffsComponent implements OnInit {
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
  constructor(
    private userProfileService: UserProfileService,
    private adminService: AdminService,
    private menuService: MenuService) {
    this.audio = new Audio();
    this.audio.src = "./../assets/music/demonstrative.mp3";
  }

  ngOnInit() {
    // this.hasMessage = false;
    // this.callPayment = true; //Quang: if customers calls payment => callPayment = true
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

    this.stompClient = Stomp.client(websocketUrl + "admin");
    this.stompClient.connect({}, (frame) => {
                    console.log('Connected: ' + frame);
                    console.log(this.stompClient);
                    // Uncomment for heroku app
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
                      if(messageOutput.body.includes("needing some help") || messageOutput.body.includes("ready")){
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
          $('#tableUnpay').modal('hide');
          this.isPayed = res;
          console.log("pay ", this.isPayed );
          localStorage.removeItem("invoiceId");
        }
      },
        err => {console.log(err)});
  }

}
