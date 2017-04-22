import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ad-home',
  templateUrl: './ad-home.component.html',
  styleUrls: ['./ad-home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdHomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  showBuild(id: number) {
    this.router.navigate(['/detail-ordering']);
  }
}
