import { Component, OnInit, ElementRef } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserProfileComponent implements OnInit {
  email: string;
  name: string;
  password: string;
  birthDay: any;
  constructor( private elr: ElementRef) {
    console.log("%%% here");

  }

  ngOnInit() {
    this.birthDay = new Date('2017, 12, 13');
  }

  edit(type) {
    var editField = this.elr.nativeElement.getElementsByTagName("input");
    switch (type) {
      case "email":
        // var inputEmail = this.email;
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

  saveProfile() {
    console.log("$$$$");

    console.log("email "+ this.email);
    console.log("pass "+ this.password);
    console.log("name "+ this.name);

  }
}
