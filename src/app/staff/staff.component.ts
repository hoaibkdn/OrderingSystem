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
    this.audio.src = "./../assets/music/nokia_tuneoriginal.mp3";
  }

  ngOnInit() {
    this.hasMessage = false;
    this.music("off",this.audio);
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    let allMessage = localStorage.getItem('allMessage') == null ? "" : localStorage.getItem('allMessage');
    if (allMessage.includes("?")){
      let listMessage = allMessage.split('?');
      for (var i = 1; i < listMessage.length; i++) {
      this.addMessage(listMessage[i]);
      console.log(1);
      }
    }

    this.stompClient = Stomp.client("wss://backend-os-v2.herokuapp.com/admin");
    this.stompClient.connect({}, (frame) => {
                    console.log('Connected: ' + frame);
                    // this.music("on",this.audio);
                    console.log('turn on music ');
                    this.stompClient.send("/app/admin", {}, this.userInfo.name + " is available.");
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
                      console.log(2);
                      var tag = document.getElementsByClassName('chat-box')[0];
                      let allMessage = localStorage.getItem('allMessage') == null ? "" : localStorage.getItem('allMessage');
                      localStorage.setItem('allMessage', allMessage + "?" + messageOutput.body);
                      console.log("Received message: ", messageOutput.body);
                      this.message = messageOutput.body;
                      this.addMessage(messageOutput.body);
                    });
                });
	};

	sendMessageAdmin(): void {
		if (this.message != null && this.message.includes("-")){
      this.stompClient.send("/app/admin", {}, this.userInfo.name + " accept request at " + this.message.split("-")[0].trim());
    } else {
      this.stompClient.send("/app/admin", {}, this.userInfo.name + " is available.");
    }
    this.music("off", this.audio);
    this.hasMessage = false;
	};

	addMessage(message: string) {
    this.hasMessage = true;
    this.music("on", this.audio);
	  let ul = document.getElementsByClassName("message")[0];
    var existLi = document.getElementsByTagName('li');
    if(!existLi) {
      let li = document.createElement("li");
      li.appendChild(document.createTextNode(message));
      ul.appendChild(li);
    }
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
