import { Component, OnInit, ElementRef } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { UserProfileService } from './user-profile.service';
import { User } from './../models/user';
import { Router, ActivatedRoute, Params } from '@angular/router';

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
        if(this.userProfile.gender === 1) this.gender = "Male";
        else if(this.userProfile.gender === 0) this.gender = "Female";
        else if(this.userProfile.gender !== 0 && this.userProfile.gender !== 1) this.gender = "Other";
        });
  }

  saveProfile() {
    var date = new Date();
    this.userProfile.dateOfBirth = date.getTime();
    var profileUpdated = {
      dateOfBirth: this.userProfile.dateOfBirth,
      detail: this.userProfile.detail,
      gender: this.userProfile.gender,
      name: this.userProfile.name
    };
    if(this.reNewPassword) {
      this.userProfileService.updatePassword(this.reNewPassword)
        .subscribe(res => console.log('new pass ', res));
    }
    console.log("user profile ", profileUpdated);
    this.userProfileService.updateProfile(profileUpdated)
      .subscribe(res => console.log('user update ', res));
    this.router.navigate(["/"]);
  }
}
