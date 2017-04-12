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
  chart: Chart;
  point: any;
  // chartData: any;
  // chartOptions: any;
  ratingArr: Rating[];
  constructor(private adStatisticDrinkService: AdStatisticDrinkService) {}
    ngOnInit(){
      // console.log(this.chart);
      // var point = null;
      this.adStatisticDrinkService.getRatingDrink()
          .subscribe(ratingArr => {this.ratingArr = ratingArr; console.log(this.ratingArr);
            this.chart = new Chart({
      chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          title: {
              text: 'Statistic by food and drink'
          },
          tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
              pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                      enabled: true,
                      format: '<b>{point.name}</b>: {point.percentage:.1f} %',

                  },
              },
              series: {
                cursor: 'pointer',
                events:{
                  click: function (event) {
                      alert(
                        "current "
                      );
                  }
              }

            }
          },
          series: [{
              name: 'Brands',
              data: [{
                  name: '5*',
                  y: parseInt(this.ratingArr[4].numOfPeople),
                  sliced: true,
                  selected: true,
              }, {
                  name: '4*',
                  y: parseInt(this.ratingArr[3].numOfPeople),
              }, {
                  name: '3*',
                  y: parseInt(this.ratingArr[2].numOfPeople)
              }, {
                  name: '2*',
                  y: parseInt(this.ratingArr[1].numOfPeople)
              }, {
                  name: '1*',
                  y: parseInt(this.ratingArr[0].numOfPeople)
              }]
          }]
        }
      );

        // set event

    });

  }

    getDetailRating() {
      console.log("detail here");
    }
}
