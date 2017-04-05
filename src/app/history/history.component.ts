import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HistoryComponent implements OnInit {

  constructor() {
    console.log("history");

   }

  ngOnInit() {
  }

}
