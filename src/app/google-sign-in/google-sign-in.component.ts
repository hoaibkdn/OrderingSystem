import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { UserAuthenticationService } from '../user-authentication/user-authentication.service';
import { UserProfileService } from '../user-profile/user-profile.service';
import { Permission } from '../models/permission';
import { Router } from '@angular/router';
declare const gapi: any;
declare var $:any;

@Component({
  selector: 'app-google-sign-in',
  templateUrl: './google-sign-in.component.html',
  styleUrls: ['./google-sign-in.component.scss']
})
export class GoogleSignInComponent implements AfterViewInit {

  constructor(private router: Router, private element: ElementRef, private userAuthenticationService: UserAuthenticationService, private userProfileService: UserProfileService) {
  }

  private clientId:string = '841843481336-uaje8r0pj66c5g4dj099o9vqa1lmb78g.apps.googleusercontent.com';
  
  private scope = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/admin.directory.user.readonly'
  ].join(' ');

  doAfterLogin(){
    this.userProfileService.getInfo().subscribe(res => {
        localStorage.setItem("userInfo", JSON.stringify(res));
        }, err => {
          console.log("Error: ", err);
        });
        this.userProfileService.getPermission().subscribe(res => {
          let typeOfAccount = this.typeOfAccount(res);
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
              // this.router.navigate([""]);
              this.router.navigate(["/history/invoice"]);
              $('#login').modal('hide');
              break;
          }
        });
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

  public auth2: any;
  public googleInit() {
    let that = this;
    gapi.load('auth2', function () {
      that.auth2 = gapi.auth2.init({
        client_id: that.clientId,
        cookiepolicy: 'single_host_origin',
        scope: that.scope
      });
      that.attachSignin(that.element.nativeElement.firstChild);
    });
  }
  public attachSignin(element) {
    let that = this;
    this.auth2.attachClickHandler(element, {},
      function (googleUser) {
        let profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
            that.userAuthenticationService.loginByGoogle(googleUser.getAuthResponse().id_token).subscribe(res => {
            let token = res.json().token;
            console.log(token);
            localStorage.setItem('token', token);
            // Hoai: Do some logic code after logged in here
            that.doAfterLogin();
            window.location.reload();
          },
          err => {
            console.log("Error: " + err);
          })
      }, function (error) {
        console.log(JSON.stringify(error, undefined, 2));
      });
  }

  ngAfterViewInit() {
    this.googleInit();
  }

  
}


