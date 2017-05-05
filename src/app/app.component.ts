import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { Permission } from './models/permission';
import { ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FacebookService, LoginResponse, InitParams } from 'ng2-facebook-sdk';
import { UserAuthenticationService } from './user-authentication/user-authentication.service';
import { UserProfileService } from './user-profile/user-profile.service';
import { AppService } from './app.service';
import { LoadingPage } from './loading-indicator/loading-page';
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
export class AppComponent extends LoadingPage implements OnInit {

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
  isAdmin: boolean;

  getOrdering: boolean;
  isLoading: boolean;
  objSignUp: Object;
  confirmPassword: string;

  constructor(
    private router: Router,
    private facebookService: FacebookService,
    private userAuthenticationService: UserAuthenticationService,
    private userProfileService: UserProfileService,
    private appService: AppService) {
      super(false);
      let fbParams: InitParams = {
                                     appId: '830527260415888',
                                     xfbml: true,
                                     version: 'v2.5'
                                     };
      this.facebookService.init(fbParams);
      this.objSignUp = {
        email: "",
        name: "",
        password: "",
        roleId: "4"
      },
      this.confirmPassword = "";
  }

  ngOnInit() {
    this.isLoading = false;
    // localStorage.setItem('isCustomer', true + "");
    this.getOrdering = false;
    var isCustomer = localStorage.getItem('isCustomer');
    if(isCustomer) {
      this.isCustomer = (isCustomer === "true");
      console.log('isCustomer ', this.isCustomer);
    }
    else {
      this.isCustomer = true;
      localStorage.setItem('isCustomer', true + "");
      console.log('isCustomer ', this.isCustomer);
    }
    var isAdmin = localStorage.getItem('isAdmin');
    if(isAdmin) {
      this.isAdmin = (isAdmin === "true");
      console.log('isAdmin ', this.isAdmin);
    }
    else {
      this.isAdmin = false;
    }
    this.countDown = 0;
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
    var self = this;
    $('body').on('click', function() {
      var signUpIsOpen = $('#signUp').hasClass('in');
      if(!signUpIsOpen) {
        self.objSignUp = {
          email: "",
          name: "",
          password: "",
          roleId: "4"
        };
        self.confirmPassword="";
        console.log('close sign up ', self.objSignUp);
      }
    })
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
    this.standby();
    this.userAuthenticationService.logIn(this.inputEmail, this.inputPassword, "https://orderingsys.herokuapp.com").subscribe(
      res => {
        console.log(res);
        $('#login').modal('hide');
        this.token = res.json().token;
        localStorage.setItem('token', this.token);
        this.doAfterLogin();
        this.ready();
        console.log('isLoading2 ', this.isLoading);
      }, err => {
        alert("Oops! You might have used wrong email/password. Please check it again.")
        console.log("Error: ", err);
      })
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
              this.isAdmin = true;
              localStorage.setItem('isCustomer', this.isCustomer.toString());
              localStorage.setItem('isAdmin', this.isAdmin.toString());
              this.router.navigate(["/admin"]);
              $('#login').modal('hide');
            break;
            case "STAFF":
              this.isCustomer = false;
              localStorage.setItem('isCustomer', this.isCustomer.toString());
              this.isAdmin = false;
              localStorage.setItem('isAdmin', this.isAdmin.toString());
              this.router.navigate(["/staff"]);
              $('#login').modal('hide');
              break;
            default:
              this.isCustomer = true;
              localStorage.setItem('isCustomer', this.isCustomer.toString());
              this.isAdmin = false;
              localStorage.setItem('isAdmin', this.isAdmin.toString());
              this.router.navigate([""]);
              $('#login').modal('hide');
              break;
          }
        });
  }

  logOut() {
    if(localStorage.getItem('isPayed') === true + ""){
      alert("Oops! You haven't paid your invoice but hitting log out button.");
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('allMessage');
      localStorage.removeItem('foodOrderLocal');
      localStorage.removeItem('isCustomer');
      localStorage.removeItem('isAdmin');
      if (localStorage.getItem('isPayed')){
        localStorage.removeItem('isPayed');
      }
      console.log('Is payed: ', localStorage.getItem('isPayed'));
      console.log('Food local order: ', localStorage.getItem('foodOrderLocal'));
      this.userName = "Anonymous user";
      this.token = null;
      this.isCustomer = true;
      this.isAdmin = false;
      localStorage.setItem('isCustomer', true + "");
      this.router.navigate(['']);
    }
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

  showModalSignUp() {
    $('#login').modal('hide');
  }

  signUp() {
    var objUser = this.objSignUp;
    console.log("object user ", this.objSignUp);
    this.appService.signUp(objUser)
      .subscribe(res => {console.log("new account ", res);
      this.token = res;
      localStorage.setItem('token', this.token)});
    this.router.navigate(["/"]);
    $('#signUp').modal('hide');
  }

  closeSignUp() {
    this.objSignUp = {
      email: "",
      name: "",
      password: "",
      roleId: "4"
    };
    this.confirmPassword = "";
    // this.objSignUp.roleId = "4";
    this.router.navigate(["/"]);
    $('#signUp').modal('hide');
  }
}
