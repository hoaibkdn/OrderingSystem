import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { UserAuthenticationService } from '../user-authentication/user-authentication.service';
declare const gapi: any;

@Component({
  selector: 'app-google-sign-in',
  templateUrl: './google-sign-in.component.html',
  styleUrls: ['./google-sign-in.component.scss']
})
export class GoogleSignInComponent implements AfterViewInit {

  constructor(private element: ElementRef, private userAuthenticationService: UserAuthenticationService) {
  }

  private clientId:string = '841843481336-uaje8r0pj66c5g4dj099o9vqa1lmb78g.apps.googleusercontent.com';
  
  private scope = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/admin.directory.user.readonly'
  ].join(' ');

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
            // Hoai: Do some logic code after logged in here
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
