import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'angular-highcharts';
import { AdminService } from './../admin/admin.service';
import { TotalMoney } from './../models/total-money';

@Component({
  selector: 'app-ad-statistic-monthly',
  templateUrl: './ad-statistic-monthly.component.html',
  styleUrls: ['./ad-statistic-monthly.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdStatisticMonthlyComponent implements OnInit {
  chart: Chart;
  totalMoney: TotalMoney[];
  income: number[];
  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.adminService.getTotalMonthly()
      .subscribe(res => {this.totalMoney = res;
        this.route.data.subscribe(
          (data: {year: number} ) => {
            console.log('year ', data.year);
            var showIncomYear = data.year;
          var income = this.filterIncomeByYear(this.totalMoney, data.year);
          console.log('income ', income);

          this.chart = new Chart({
          chart: {
              type: 'line'
            },
            title: {
                text: 'Monthly Average Total'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Income in a year'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }
            },
            series: [{
                name: '2017',
                data: income
            }]
          });
          }
        )});
  }

  filterIncomeByYear(allIncome: TotalMoney[], year: number) {
    var size = allIncome.length;
    var total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for(var i = 0; i < size; i++) {
      if(parseInt(allIncome[i].year) == year) {
        for(var j = 1; j <= 12; j++) {

          console.log('12 months ', parseInt(allIncome[i].month));
          if(parseInt(allIncome[i].month) == j) {
            total[j-1] += parseFloat(allIncome[i].total);
          }
        }
        // objMonthly.month =
      }
    }
    return total;
  }
}
