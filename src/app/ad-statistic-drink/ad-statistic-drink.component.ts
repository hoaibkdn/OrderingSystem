import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
// import { GoogleChart } from 'angular2-google-chart/directives/angular2-google-chart.directive';
import { AdStatisticDrinkService } from './ad-statistic-drink.service';
import { Rating } from '../models/Rating';
import { Chart } from 'angular-highcharts';
// declare var Chart: any;

@Component({
  selector: 'app-ad-statistic-drink',
  templateUrl: './ad-statistic-drink.component.html',
  styleUrls: ['./ad-statistic-drink.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AdStatisticDrinkComponent implements OnInit{
  // chartData: any;
  // chartOptions: any;
  // ratingArr: Rating[];
  constructor(private adStatisticDrinkService: AdStatisticDrinkService) {

  }
    // public pie_ChartData;
    // public pie_ChartOptions  = {
    //   title: 'Statistic by food',
    //   width: 600,
    //   height: 350
    // };

    chart = new Chart({
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Linechart'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                  style: {
                      color: (this.chart.theme && this.chart.theme.contrastTextColor) || 'black'
                  }
              }
          }
      },
      series: [{
          name: 'Brands',
          data: [{
              name: 'Microsoft Internet Explorer',
              y: 56.33
          }, {
              name: 'Chrome',
              y: 24.03,
              sliced: true,
              selected: true
          }, {
              name: 'Firefox',
              y: 10.38
          }, {
              name: 'Safari',
              y: 4.77
          }, {
              name: 'Opera',
              y: 0.91
          }, {
              name: 'Proprietary or Undetectable',
              y: 0.2
          }]
      }]
    });


    ngOnInit(){
      console.log(this.chart);

      // this.adStatisticDrinkService.getRatingDrink()
      //     .subscribe(ratingArr => {this.ratingArr = ratingArr; console.log(this.ratingArr);
      //       this.pie_ChartData = [
      //         ['Task', 'Hours per Day'],
      //         ['5 *', parseInt(this.ratingArr[4].numOfPeople + "")],
      //         ['4 *', parseInt(this.ratingArr[3].numOfPeople + "")],
      //         ['3 *', parseInt(this.ratingArr[2].numOfPeople + "")],
      //         ['2 *', parseInt(this.ratingArr[1].numOfPeople + "")],
      //         ['1 *', parseInt(this.ratingArr[0].numOfPeople + "")]
      //       ]; console.log(this.pie_ChartData);
      //     });

    }


}
