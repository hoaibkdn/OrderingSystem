import { Component, OnInit, ViewEncapsulation } from '@angular/core';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AdminComponent implements OnInit {
	// stompClient: any;
  constructor() { }

  ngOnInit() {
  	// this.stompClient = Stomp.client("wss://backend-os-v2.herokuapp.com/admin");
  	// this.stompClient.connect({}, (frame) => {
   //      console.log('Connected admin: ' + frame);
   //      console.log(this.stompClient);
   //      setInterval(() => {
   //          if(!this.stompClient.connected){
   //            console.log("Failed to connect");
   //          } else {
   //            console.log("Interval at " + new Date());
   //            this.stompClient.send("/app/admin", {}, "");
   //          }
   //        }, 30000);
   //      this.stompClient.subscribe('/request/admin', (messageOutput) => {
   //        var tag = document.getElementsByClassName('chat-box')[0];
   //        console.log("Received message: ", messageOutput.body);
   //      });
   //  });
  }

}
