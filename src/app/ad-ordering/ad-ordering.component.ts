import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-ad-ordering',
  templateUrl: './ad-ordering.component.html',
  styleUrls: ['./ad-ordering.component.scss']
})
export class AdOrderingComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    console.log('id ', this.route.params);
  }

}
