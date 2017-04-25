import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Chart } from 'angular-highcharts';
import { AdminService } from './../admin/admin.service';
import { TotalMoney } from './../models/total-money';
import * as _ from 'lodash';

@Component({
  selector: 'app-ad-statistic-money',
  templateUrl: './ad-statistic-money.component.html',
  styleUrls: ['./ad-statistic-money.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdStatisticMoneyComponent implements OnInit{
  years:number[];
  totalMoney: TotalMoney[];
  constructor(
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.adminService.getTotalMonthly()
      .subscribe(res => {this.totalMoney = res;
        this.years = this.filterYear(this.totalMoney);
        console.log('total money ', this.totalMoney);
        });
  }

  filterYear(allYears: TotalMoney[]) {
    var size = allYears.length;
    var years = [];
    for(var i = 0; i < size; i++) {
      years.push(parseInt(allYears[i].year));
    }
    return _.sortedUniq(years);
  }

  showIncome(year: number) {
    console.log('showIncome ', year);
    this.router.navigate([year], { relativeTo: this.route });
  }
}
