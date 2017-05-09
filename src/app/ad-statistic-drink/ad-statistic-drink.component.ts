import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { AdStatisticDrinkService } from './ad-statistic-drink.service';
import { HistoryInvoiceService } from './../history-invoice/history-invoice.service';
import { Rating } from '../models/Rating';
import { Chart } from 'angular-highcharts';
import { Highcharts } from 'angular-highcharts';
import { RatingGet } from '../models/rating-get';
import { InvoiceDetail } from '../models/invoice-detail';

@Component({
  selector: 'app-ad-statistic-drink',
  templateUrl: './ad-statistic-drink.component.html',
  styleUrls: ['./ad-statistic-drink.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AdStatisticDrinkComponent implements OnInit{
  chart: Chart;
  point: any;
  ratingArr: Rating[];
  ratingDrinkDetail: RatingGet[];
  ratingServiceDetail: RatingGet[];
  ratingAll: RatingGet[];
  invoiceDetails: InvoiceDetail[];
  sortBy = "rateTime";
  constructor(
    private adStatisticDrinkService: AdStatisticDrinkService,
    private historyInvoiceService: HistoryInvoiceService) {}
    ngOnInit() {
      this.getDetailRating();
      this.adStatisticDrinkService.getRatingDrink()
          .subscribe(ratingArr => {
            this.ratingArr = ratingArr; 
            console.log(this.ratingArr);
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
              text: 'Statistical data of food quality rating'
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
        }
      );

        // set event

    });

  }

    getDetailRating() {
      this.adStatisticDrinkService.getDetailRating()
        .subscribe(res => {this.ratingAll = res;
          console.log('all rate ', this.ratingAll);
          this.ratingDrinkDetail = this.filterRating(this.ratingAll, 1);
          // this.ratingServiceDetail = this.filterRating(this.ratingAll, 2);
        });
    }

    filterRating(allRating: RatingGet[], type: number) {
      var filteredRating = [];
      allRating.forEach((rate, index) => {
        if(rate.rateType.id === type) {
          filteredRating.push(rate);
        }
      });
      return filteredRating;
    }

    getInvoiceDetail(id: string) {
    console.log('id detail ', id);
    this.invoiceDetails = [];
    this.historyInvoiceService.getInvoiceDetail(id)
      .subscribe(invoiceDetails => {this.invoiceDetails = invoiceDetails;
        console.log('invoice detail ', this.invoiceDetails);
      });
    }

}
