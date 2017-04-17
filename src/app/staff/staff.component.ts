import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { UserProfileService } from '../user-profile/user-profile.service';

declare var Stomp: any;

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

  constructor(private userProfileService: UserProfileService) {

  }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    let allMessage = localStorage.getItem('allMessage') == null ? "" : localStorage.getItem('allMessage');
    if (allMessage.includes("?")){
      let listMessage = allMessage.split('?');
      for (var i = 1; i < listMessage.length; i++) {
      this.addMessage(listMessage[i]);
      }
    }
    
    this.stompClient = Stomp.client("ws://backend-os-v2.herokuapp.com/admin");
    this.stompClient.connect({}, (frame) => {
                    console.log('Connected: ' + frame);
                    this.stompClient.subscribe('/request/admin', (messageOutput) => {
                      var tag = document.getElementsByClassName('chat-box')[0];
                      let allMessage = localStorage.getItem('allMessage') == null ? "" : localStorage.getItem('allMessage');
                      localStorage.setItem('allMessage', allMessage + "?" + messageOutput.body);
                      console.log(messageOutput.body);
                      this.message = messageOutput.body;
                      this.addMessage(messageOutput.body);
                      setInterval(() => {
                        console.log("Interval");
                        this.stompClient.send("/app/admin", {}, "");
                      }, 50000);
                    });
                });
	};

	sendMessageAdmin(): void {
		if (this.message != null && this.message.includes("-")){
      this.stompClient.send("/app/admin", {}, this.userInfo.name + " accept request at " + this.message.split("-")[0].trim());
    } else {
      this.stompClient.send("/app/admin", {}, this.userInfo.name + " is available.");
    }
	};

	addMessage(message: string) {
	  let ul = document.getElementsByClassName("message")[0];
	  let li = document.createElement("li");
	  li.appendChild(document.createTextNode(message));
	  ul.appendChild(li);
	}

}
