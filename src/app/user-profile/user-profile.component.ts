import { Component, OnInit, ElementRef } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { UserProfileService } from './user-profile.service';
import { User } from './../models/user';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserProfileComponent implements OnInit {
  gender: string;
  currentPassword: string;
  newPassword: string;
  reNewPassword: string;
  userProfile: User;
  constructor( private elr: ElementRef,
              private userProfileService: UserProfileService,
              private router: Router) {
  }

  ngOnInit() {
    this.getUserProfile();
  }

  edit(type) {
    var editField = this.elr.nativeElement.getElementsByTagName("input");
    switch (type) {
      case "email":
        editField[0].removeAttribute("readonly");

        break;
      case "name":
        editField[1].removeAttribute("readonly");
        break;
      case "password":
        editField[2].removeAttribute("readonly");
        break;
    }
  }

  getUserProfile() {
    this.userProfileService.getInfo()
      .subscribe(res => {this.userProfile = res;
        console.log("user profile ", this.userProfile);
        if(this.userProfile.gender === 0) this.gender = "Male";
        else if(this.userProfile.gender === 1) this.gender = "Female";
        else if(this.userProfile.gender !== 0 && this.userProfile.gender !== 1) this.gender = "Other";
        });
  }

  saveProfile(birthDay: any) {
    console.log(this.userProfile.dateOfBirth, birthDay);
    if (this.userProfile.detail == null){
      this.userProfile.detail = "";
    }
    var profileUpdated = {
      dateOfBirth: new Date(birthDay).getTime(),
      detail: this.userProfile.detail,
      gender: this.userProfile.gender,
      name: this.userProfile.name
    };
    this.userProfileService.updateProfile(profileUpdated)
      .subscribe(res => {
        console.log('user update ', res);
        if (res.status == 201){
          alert("Update profile successfully!");
        }
      }, err => {
        console.log(err);
      });
    if(this.reNewPassword) {
      console.log('update profile');
      let body = {"currentPassword": this.currentPassword, "newPassword": this.newPassword};
      console.log(body);
      this.userProfileService.updatePassword(body)
        .subscribe(res => {
          console.log('new pass ', res);
          if (res.status == 200){
            alert("Update password successfully");
            this.newPassword = "";
            this.reNewPassword = "";
            this.currentPassword = "";
          }
        }, err => {
          console.log(err);
        });
        $('#changePass').modal('show');
    }
    console.log("user profile ", profileUpdated);
    this.router.navigate(["/userprofile"]);
  }
}
