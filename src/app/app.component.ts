import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { Permission } from './models/permission';
import { ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FacebookService, LoginResponse, InitParams } from 'ng2-facebook-sdk';
import { UserAuthenticationService } from './user-authentication/user-authentication.service';
import { UserProfileService } from './user-profile/user-profile.service';
import './../assets/qr/effects_saycheese.js';

declare var $:any;
declare var go:any;
declare var Stomp: any;
declare var SockJS: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  users: User[];
  errorMessage: string;
  inputEmail: string;
  inputPassword: string;
  token: string;
  userName: string;
  permissions: Permission[];
  stompClient: any;
  constructor(
    private router: Router, private facebookService: FacebookService, private userAuthenticationService: UserAuthenticationService, private userProfileService: UserProfileService) {
      let fbParams: InitParams = {
                                     appId: '830527260415888',
                                     xfbml: true,
                                     version: 'v2.5'
                                     };
      this.facebookService.init(fbParams);
  }

  ngOnInit() {
    this.connectAdmin();
    let that = this;
    var token = localStorage.getItem('token');
    if(token && token != null) {
      console.log('token logined ', token);
      this.token = token;
      this.userProfileService.getInfo().subscribe(res => {
        this.userName = res.name;
        localStorage.setItem("userInfo", JSON.stringify(res));
      }, err => {
        console.log("Error: ", err);
      });
    }
  }

  typeOfAccount(permissions: Permission[]): string{
    for (var i = 0; i < permissions.length; i++) {
      if(permissions[i].role.name.includes('ROLE_ADMIN')){
        return "ADMIN";
      } else if(permissions[i].role.name.includes('ROLE_STAFF')){
        return "STAFF";
      }
    } return "CUSTOMER";
  }

  facebookLogin(): void {
      this.facebookService.login().then(
      (response: LoginResponse) => {
        console.log(response);
        let token = response.authResponse.accessToken;
        this.userAuthenticationService.loginByFacebook(token).subscribe(
          res => {
            let token = res.json().token;
            localStorage.setItem('token', token);
            console.log("Token: ", token);
            this.token = token;
            this.doAfterLogin();
            $('#login').modal('hide');
            // Hoai: Add your logic code after login success here
          },
          err => {
            console.log(err);
          })
      },
      (error: any) => console.error(error)
    );
  }

  signIn() {
    // this.router.navigate(["/admin"]);
    this.userAuthenticationService.logIn(this.inputEmail, this.inputPassword, "http://localhost:4200").subscribe(
      res => {
        this.token = res.json().token;
        localStorage.setItem('token', this.token);
        this.doAfterLogin();
      }, err => {
        console.log("Error: ", err);
      }

    )
  }

  doAfterLogin(){
    this.userProfileService.getInfo().subscribe(res => {
      this.userName = res.name;
        localStorage.setItem("userInfo", JSON.stringify(res));
        }, err => {
          console.log("Error: ", err);
        });
        console.log(this.token);
        this.userProfileService.getPermission().subscribe(res => {
          this.permissions = res;
          console.log(this.permissions);
          let typeOfAccount = this.typeOfAccount(this.permissions);
          console.log("Type of account: ", typeOfAccount);
          switch (typeOfAccount) {
            case "ADMIN":
              this.router.navigate(["/admin"]);
              $('#login').modal('hide');
            break;
            case "STAFF":
              this.router.navigate(["/staff"]);
              $('#login').modal('hide');
              break;
            default:
              this.router.navigate([""]);
              $('#login').modal('hide');
              break;
          }
        });
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('allMessage');
    localStorage.removeItem('foodOrderLocal');
    this.userName = "Anonymous user";
    this.token = null;
    this.router.navigate(["/"]);
  }


  connectAdmin(): void {
    this.stompClient = Stomp.client("ws://backend-os-v2.herokuapp.com/admin");
    this.stompClient.connect({}, (frame) => {
        console.log('Connected admin: ' + frame);
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
          console.log("Received message: ", messageOutput.body);
        });
    });
  }

  sendMessageAdmin(): void {
      let message = (this.userName? this.userName : "Anonymous") + " is needing some help.";
      console.log("Message to send: ", message);
      this.stompClient.send("/app/admin", {}, message);
  };

  goScan() {
    go();
    this.router.navigate(["/scanQRcode"]);
    // console.log('here');

  }
}
