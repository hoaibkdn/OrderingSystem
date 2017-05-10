import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ResetPasswordComponent implements OnInit {
  newPassword:string;
  confirmNewPassword: string;

  constructor() { }

  ngOnInit() {
    console.log('reset pass');

  }

}
