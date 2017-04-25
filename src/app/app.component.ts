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

  countDown: number;
  isCustomer: boolean;

  getOrdering: boolean;

  longitude: number;
  latitude: number;
  distance: number;
  resLon: number;
  resLat: number;
  options = {
    timeout: 10000
  };
  constructor(
    private router: Router, private facebookService: FacebookService, private userAuthenticationService: UserAuthenticationService, private userProfileService: UserProfileService) {
      let fbParams: InitParams = {
                                     appId: '830527260415888',
                                     xfbml: true,
                                     version: 'v2.5'
                                     };
      this.facebookService.init(fbParams);

  }

  error(err) {
    console.log(err);
  }

  setPosition(position){
      this.longitude = position.coords.longitude;
      this.latitude = position.coords.latitude;
      this.userProfileService.getLocation().subscribe(res => {
        let location = res._body;
        this.resLat = location.split(',')[0];
        this.resLon = location.split(',')[1];
        localStorage.setItem('resLat', this.resLat + "");
        localStorage.setItem('resLon', this.resLon + "");
        this.distance = this.distanceInKmBetweenEarthCoordinates(this.resLat, this.resLon, this.latitude, this.longitude);
        console.log("Distance: ", this.distance.toFixed(2), " km");
      }, err => {
        console.log(err);
      })
  }


  ngOnInit() {
    localStorage.setItem('isCustomer', true + "");
    this.getOrdering = false;
    var isCustomer = localStorage.getItem('isCustomer');
    if(isCustomer) {
      this.isCustomer = (isCustomer === "true");
      console.log('isCustomer ', this.isCustomer);
    }
    else {
      this.isCustomer = true;
    }
    this.countDown = 0;
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(this.setPosition.bind(this), this.error, this.options);
     } else {
         alert("No location is supported");
     }
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

  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  // https://en.wikipedia.org/wiki/Haversine_formula
    var earthRadiusKm = 6371;

    var dLat = this.degreesToRadians(lat2-lat1);
    var dLon = this.degreesToRadians(lon2-lon1);

    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    this.distance = earthRadiusKm * c * 1000
    return earthRadiusKm * c;
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
    this.userAuthenticationService.logIn(this.inputEmail, this.inputPassword, "https://orderingsys.herokuapp.com").subscribe(
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
              this.isCustomer = false;
              localStorage.setItem('isCustomer', this.isCustomer.toString());
              this.router.navigate(["/admin"]);
              $('#login').modal('hide');
            break;
            case "STAFF":
              this.isCustomer = false;
              localStorage.setItem('isCustomer', this.isCustomer.toString());
              this.router.navigate(["/staff"]);
              $('#login').modal('hide');
              break;
            default:
              this.isCustomer = true;
              localStorage.setItem('isCustomer', this.isCustomer.toString());
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
    localStorage.removeItem('isCustomer');
    this.userName = "Anonymous user";
    this.token = null;
    this.router.navigate(["/"]);
    location.reload();
  }


  connectAdmin(): void {
    this.stompClient = Stomp.client("wss://backend-os-v2.herokuapp.com/admin");
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
          if(messageOutput.body.includes("is ordering")){
            this.getOrdering = true;
          }
        });
    });
  }

  sendMessageAdmin(): void {
    let message = (this.userName? this.userName : "Anonymous") + " is needing some help.";
    console.log("Message to send: ", message);
    this.stompClient.send("/app/admin", {}, message);
    this.startCountDown();
  };

  goScan() {
    go();
    this.router.navigate(["/scanQRcode"]);
    // console.log('here');

  }

  startCountDown() {
    this.countDown = 10;
    var self = this;
    var count = 10;
    console.log('count down ', this.countDown);
    var startCount = setInterval(function() {
      self.countDown--;
      console.log('count down ', self.countDown);
      if(self.countDown === 0) clearInterval(startCount);
    }, 1000);

  }
}
