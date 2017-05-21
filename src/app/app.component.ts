import { Component, OnInit, NgZone } from '@angular/core';
import { User } from './models/user';
import { Permission } from './models/permission';
import { ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FacebookService, LoginResponse, InitParams } from 'ng2-facebook-sdk';
import { UserAuthenticationService } from './user-authentication/user-authentication.service';
import { UserProfileService } from './user-profile/user-profile.service';
import { AppService } from './app.service';
import { LoadingPage } from './loading-indicator/loading-page';
import { Table } from './models/table';
import { AdminService } from './admin/admin.service';
import { websocketUrl } from './server-url.config';
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

  currentUser: User;
  errorMessage: string;
  inputEmail: string;
  inputPassword: string;
  token: string;
  userName: string;
  permissions: Permission[];
  stompClient: any;
  longitude: number;
  latitude: number;
  distance: number;
  resLon: number;
  resLat: number;
  isReserved: boolean;
  options = {
    timeout: 10000
  };

  countDown: number;
  isCustomer: boolean;
  isAdmin: boolean;
  // isReserved: boolean;

  getOrdering: boolean;
  isLoading: boolean;
  objSignUp: Object;
  confirmPassword: string;

  currentTable: Table;
  tables: Table[];
  temporaryTable:Table;
  emailForgetPass: Object;
  // conditionPointReserved: number = 10;
  // conditionPositionReserved: number = 100;

  reservedPeople: string;
  reservedTime: string;
  minsTimeReserve: number;
  emptyTables: Table[] = [];
  validTables: Table[] = [];
  temporaryReservingTable: Table;
  countDownReserving: boolean = false;
  timeCountMinsReserve: number;
  timeCountSecsReserve: number;
  constructor(
    private router: Router,
    private facebookService: FacebookService,
    private userAuthenticationService: UserAuthenticationService,
    private userProfileService: UserProfileService,
    private appService: AppService,
    private adminService: AdminService) {
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
      this.emailForgetPass = {
        "email": "",
        "urlPath": "http://localhost:4200/#/"
      }
  }

  ngOnInit() {
    // localStorage.removeItem("timestartReserved");
    // localStorage.removeItem("countDownReserving");
    console.log("Init app component");
    var self = this;
    this.isLoading = false;
    this.token = localStorage.getItem('token');
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
      }
    });

    var existedTable = localStorage.getItem('currentTable');
    if(existedTable) {
      this.currentTable = JSON.parse(localStorage.getItem('currentTable'));
      console.log('table init ', this.currentTable);
    }

    // var timeReservedStr = localStorage.getItem("timestartReserved");
    // var permitCount = localStorage.getItem("countDownReserving");
    // if(permitCount) {
    //   this.countDownReserving = (permitCount === "true");
    // }
    // else this.countDownReserving = false;
    // if(timeReservedStr) {
    //   var timeReserved = parseFloat(timeReservedStr);
    //   var currentTime = new Date().getTime();
    //   var spentTime = currentTime - timeReserved;
    //   var mins = new Date(spentTime).getMinutes();
    //   var localMinsComing = parseInt(localStorage.getItem("minsTimeReserve"));
    //   console.log('this.minsTimeReserve ', localMinsComing);
    //   var secs = new Date(spentTime).getSeconds();
    //   var remainMins = localMinsComing - 1 - mins;
    //   console.log('remainMins ', parseFloat(this.reservedTime));

    //   var remainSecs = 60 - secs;
    //   this.countDownReserved(remainMins, remainSecs);
    //   // console.log('spentTime ', mins);
    // }
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
            this.router.navigate(['']);
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
    this.userAuthenticationService.logIn(this.inputEmail, this.inputPassword, "https://orderingsys.herokuapp.com/#/").subscribe(
      res => {
        console.log(res);
        $('#login').modal('hide');
        this.token = res.json().token;

        localStorage.setItem('token', this.token);
        this.doAfterLogin();
        this.ready();
        console.log('isLoading2 ', this.isLoading);
        // this.router.navigate(['/']);
        // location.reload();
        // this.checkShowBtnReserve();
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
              this.router.navigate(["/history/invoice"]);
              $('#login').modal('hide');
              break;
          }
        });
  }

  logOut() {
    if(localStorage.getItem('isPaid') === true + ""){
      alert("Oops! You haven't paid your invoice but hitting log out button.");
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('allMessage');
      localStorage.removeItem('foodOrderLocal');
      localStorage.removeItem('isCustomer');
      localStorage.removeItem('isAdmin');
      // this.isReserved = false;
      if (localStorage.getItem('isPaid')){
        localStorage.removeItem('isPaid');
      }
      console.log('Is payed: ', localStorage.getItem('isPaid'));
      console.log('Food local order: ', localStorage.getItem('foodOrderLocal'));
      this.userName = "Anonymous user";
      this.token = null;
      this.isCustomer = true;
      this.isAdmin = false;
      localStorage.setItem('isCustomer', true + "");
      localStorage.setItem('isReserved', false + "");
      this.isReserved = false;
      this.router.navigate(['/']);
      location.reload();
    }

  }


  connectAdmin(): void {
    this.stompClient = Stomp.client(websocketUrl + "admin");
    this.stompClient.connect({}, (frame) => {
        console.log('Connected admin: ' + frame);
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
          console.log("Received message: ", messageOutput.body);
          if(messageOutput.body.includes("is ordering")){
            this.getOrdering = true;
          }
        });
    });
  }

  sendMessageAdmin(): void {
    let table = JSON.parse(localStorage.getItem('currentTable'));
    console.log("Current table", table);
    let message = "";
    if(table){
        message = "Table " + table.tableNumber + " is needing some help.";
    } else {
        console.log("Temp table: ", this.temporaryTable);
        if(this.temporaryTable) {
        this.currentTable = this.temporaryTable;
        localStorage.setItem('currentTable', JSON.stringify(this.currentTable));
        message = "Table " + this.currentTable.tableNumber + " is needing some help.";
        console.log("Message to send: ", message);
        $('#chooseTables').modal('hide');
      }
    }
    this.stompClient.send("/app/admin", {}, message);
    this.startCountDown();
  };

  goScan() {
    go();
    this.router.navigate(["/scanQRcode"]);
    // console.log('here');

  }

  startCountDown() {
    this.countDown = 30;
    var self = this;
    // var count = 10;
    // console.log('count down ', this.countDown);
    var startCount = setInterval(function() {
      self.countDown--;
      // console.log('count down ', self.countDown);
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
    // this.checkShowBtnReserve();
    this.router.navigate(["/"]);
    location.reload();
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

  chooseTable():any {
    var allTable = this.adminService.getAllTable()
      .subscribe(res => {this.tables = JSON.parse(res._body);;
        console.log('tables ', this.tables);});
    // if(this.currentTable) return true;
    // else false;
  }

  getNumOfTable(table: Table, reserving:  string) {
    if(table.tableStatus !== 0) {
      $('#toConfirmTable').modal('show');
    }
    else {
      this.temporaryTable = table;
      if(reserving) {
        this.temporaryReservingTable = table;
      }
    }
  }

  selectTable() {
    this.currentTable = this.temporaryTable;
    localStorage.setItem('currentTable', JSON.stringify(this.currentTable));
    console.log('choose table: ', JSON.parse(localStorage.getItem('currentTable')));
    $("#chooseTable").modal('hide');
  }

  hideLogin(){
    console.log("Hide login");
    $("#login").modal('hide');
  }

  sendEmail() {
    console.log("send email: ", this.emailForgetPass);
    this.appService.sendEmail(this.emailForgetPass).subscribe(res => {
      console.log(res);
      if (res.status == 200){
        alert("We have just sent an email with a link to reset your password. Please check your inbox (including spam) for the email. Thanks for using our service!");
        $("#forgotPass").modal('hide');
      }
    }, err => {
      console.log(err);
      alert("We can't find your email in our system. Please check it again.");
    })
  }
}
