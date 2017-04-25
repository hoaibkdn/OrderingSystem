import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { AdStatisticDrinkService } from './../ad-statistic-drink/ad-statistic-drink.service';
import { Rating } from '../models/Rating';
import { Chart } from 'angular-highcharts';
import { Highcharts } from 'angular-highcharts';

@Component({
  selector: 'app-ad-statistic-service',
  templateUrl: './ad-statistic-service.component.html',
  styleUrls: ['./ad-statistic-service.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdStatisticServiceComponent implements OnInit {
  chart: Chart;
  point: any;
  ratingArr: Rating[];
  constructor(private adStatisticDrinkService: AdStatisticDrinkService) {}
    ngOnInit(){
      this.adStatisticDrinkService.getRatingService()
          .subscribe(ratingArr => {this.ratingArr = ratingArr; console.log(this.ratingArr);
          this.chart = new Chart( {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            events:{
                  click: function (event) {
                    alert(
                      "current " + this.data
                    );
                  }
                }
          },
          title: {
              text: 'Statistic by Service'
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

                  }
              },
              series: {
                allowPointSelect: true,
                cursor: 'pointer',
                // events:{
                //   click: function (event) {
                //     // console.log(this.name);
                //     console.log(event.currentTarget);
                //     // console.log(this.series.d);
                //   }
                // }

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
        });
    });
  }
}