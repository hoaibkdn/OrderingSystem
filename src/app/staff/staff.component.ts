import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

declare var Stomp: any;

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StaffComponent implements OnInit {

  received: any;
	stompClient: any;
	socket: any;
	date: Date;
	permissionList: string;

  constructor() {

  }

  ngOnInit() {
	};

	connectAdmin(): void {
		this.stompClient = Stomp.client("ws://192.168.0.109:8080/admin");
		this.stompClient.connect({}, (frame) => {
                    console.log('Connected: ' + frame);
                    this.stompClient.subscribe('/request/admin', (messageOutput) => {
                      var tag = document.getElementsByClassName('chat-box')[0];
                    	console.log(messageOutput.body);
                      console.log(tag);

                    	this.received += messageOutput.body + "\n";
                      tag.appendChild(messageOutput.body);
                    });
                });
	}

	connectCustomer(): void {
    var tag = document.getElementsByClassName('chat-box')[0];
		this.stompClient = Stomp.client("ws://192.168.0.109:8080/staff");
		this.stompClient.connect({}, (frame) => {
                    console.log('Connected: ' + frame);
                    this.stompClient.subscribe('/request/staff', (messageOutput) => {
                    	console.log(messageOutput.body);
                    	this.received += messageOutput.body + "\n";
                      tag.appendChild(messageOutput.body);
                    	// this.addMessage(messageOutput.body);
                    });
                });
	}

	sendMessageAdmin(message: string): void {
		this.stompClient.send("/app/admin", {}, message);
	};

	sendMessageCustomer(message: string): void {
		this.stompClient.send("/app/staff", {}, message);
	};


	addMessage(message: string) {
	  let ul = document.getElementById("message");
	  let li = document.createElement("li");
	  li.appendChild(document.createTextNode(message));
	  ul.appendChild(li);
	}

}
