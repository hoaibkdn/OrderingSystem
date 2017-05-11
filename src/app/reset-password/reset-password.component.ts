import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserProfileService } from './../user-profile/user-profile.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ResetPasswordComponent implements OnInit {
  newPassword = "";
  confirmNewPassword = "";
  token = "";

  constructor(private activatedRoute: ActivatedRoute, private userProfileService: UserProfileService, private router: Router) { }

  ngOnInit() {
    console.log('reset pass');
    this.activatedRoute.queryParams.subscribe((params: Params) => {
        let token = params['token'];
        this.token = token;
        console.log(token);
      });
  }

  resetPassword(){
    if(this.token != "" && this.newPassword != ""){
      let body = {
        "token": this.token,
        "newPassword": this.newPassword
        };
      this.userProfileService.resetPassword(body).subscribe(res => {
        console.log(res);
        if (res.status == 200){
          console.log("routing");
          localStorage.setItem('token', res.json().token);
          console.log(localStorage.getItem('token'));
          alert("Reset password successfully. Now you can continue using our service!");
          this.router.navigate(['']);
          window.location.reload();
    
        }
      })
    }
  }
}
