import { Component, OnInit, ElementRef } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { UserProfileService } from './user-profile.service';
import { User } from './../models/user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserProfileComponent implements OnInit {
  gender: string;
  newPassword: string;
  reNewPassword: string;
  userProfile: User;
  constructor( private elr: ElementRef,
              private userProfileService: UserProfileService) {
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
        if(this.userProfile.gender === 1) this.gender = "Male";
        else if(this.userProfile.gender === 0) this.gender = "Female";
        else if(this.userProfile.gender !== 0 && this.userProfile.gender !== 1) this.gender = "Other";
        });
  }

  saveProfile() {
    console.log("$$$$");
    var profileUpdated = new User();
    profileUpdated = this.userProfile;
    profileUpdated.password = this.reNewPassword;
    console.log("user profile ", profileUpdated);
    this.userProfileService.updateProfile(profileUpdated);
  }
}
