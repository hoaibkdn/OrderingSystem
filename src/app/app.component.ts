import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FacebookService, LoginResponse, InitParams } from 'ng2-facebook-sdk';
import { UserAuthenticationService } from './user-authentication/user-authentication.service';
import './../assets/qr/effects_saycheese.js'

declare var $:any;
declare var go: any;

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
  constructor(
    private router: Router, private facebookService: FacebookService, private userAuthenticationService: UserAuthenticationService) {
      let fbParams: InitParams = {
                                     appId: '830527260415888',
                                     xfbml: true,
                                     version: 'v2.5'
                                     };
      this.facebookService.init(fbParams);
  }

  ngOnInit() {
    var token = localStorage.getItem('token');
    if(token) {
      console.log('token logined ', token);
      this.token = token;
    }
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
            console.log(token);
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
        console.log(this.token);
        switch (this.inputEmail) {
          case 'admin@alfrescos.com':
            this.router.navigate(["/admin"]);
            break;
          case 'hoai@alfrescos.com':
            this.router.navigate(["/staff"]);
            break;
          default:
            this.router.navigate([""]);
            break;
        }
        $('#login').modal('hide');
      }
    )
  }

  logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("foodOrderLocal");
    this.token = null;
    this.router.navigate(["/"]);
  }

  goScan() {
    go();
    // console.log('here');

  }
}
