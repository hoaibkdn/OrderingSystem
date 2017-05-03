import { Component, OnInit, ViewEncapsulation } from '@angular/core';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AdminComponent implements OnInit {
	currentYear: number;
  constructor() { }

  ngOnInit() {
  	this.currentYear = new Date().getFullYear();
  }

}
