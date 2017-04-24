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
  audio: any;
  hasMessage: boolean;
  constructor(private userProfileService: UserProfileService) {
    this.audio = new Audio();
    this.audio.src = "./../assets/music/demonstrative.mp3";
  }

  ngOnInit() {
    // this.hasMessage = false;
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
                      if(messageOutput.body.includes("is needing some help")){
                        this.hasMessage = true;
                        this.music("on", this.audio);
                      } else if(messageOutput.body.includes("accept request")){
                        this.hasMessage = false;
                      }
                      this.message = messageOutput.body;
                      this.addMessage(messageOutput.body);
                    });
                });
    setTimeout(() => {
      this.stompClient.send("/app/admin", {}, this.userInfo.name + " is available.");
    }, 4000);
	};

	sendMessageAdmin(): void {
		if (this.message != null && this.message.includes("is needing some help")){
      this.stompClient.send("/app/admin", {}, this.userInfo.name + " accept request at " + this.message.split("-")[0].trim());
      this.hasMessage = false;
      this.music("off", this.audio);
      console.log(this.hasMessage);
    }
	};

	addMessage(message: string) {
	  let ul = document.getElementsByClassName("message")[0];
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
}
