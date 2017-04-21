import { Component, OnInit } from '@angular/core';
import './../../assets/qr/effects_saycheese.js';

declare var go: any;

@Component({
  selector: 'app-scan-qrcode',
  templateUrl: './scan-qrcode.component.html',
  styleUrls: ['./scan-qrcode.component.scss']
})
export class ScanQRCodeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    go();
    // var data = go.qrcode.callback;
  }

}
