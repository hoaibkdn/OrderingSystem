import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'angular-highcharts';
import { AdminService } from './../admin/admin.service';
import { TotalMoney } from './../models/total-money';
import { Invoice } from './../models/invoice';
declare var $:any;

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
  invoices: Invoice[];
  invoiceList: Invoice[];
  sortBy = "payingTime";
  fromDate = "";
  toDate = "";
  yearToShow: number;
  totalAmount: number;
  timeForTotalAmount: string;

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
            this.yearToShow = data.year;
            this.invoices = [];
            this.getAllInvoices();
          var income = this.filterIncomeByYear(this.totalMoney, data.year);
          console.log('income ', income);

          this.chart = new Chart({
          chart: {
              type: 'line'
            },
            title: {
                text: 'Monthly Income'
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
                name: data.year + '',
                data: income
            }]
          });
          }
        )});
      
  }

  getTotalAmount(){
    let total = 0;
    for (let i = 0; i < this.invoices.length; i++) {
      total += this.invoices[i].totalAmount;
      console.log("Total: ", total);
    }
    if (this.fromDate == ""){
      this.timeForTotalAmount = "in " + this.yearToShow;
    } else {
      if (this.toDate == ""){
        this.timeForTotalAmount = "on " + this.fromDate;
      } else {
        this.timeForTotalAmount = "from " + this.fromDate + " to " + this.toDate;
      }
    }
    this.totalAmount = total;
  }

  getAllInvoices(){
    this.adminService.getAllInvoice().subscribe(res => {
        console.log(this.yearToShow);
        if (this.yearToShow == null){
          this.yearToShow = new Date().getFullYear();
        }
        this.invoices = JSON.parse(res._body);
        console.log(this.invoices.length);
        this.invoices = this.invoices.filter((invoice: Invoice) => {
          let payingTime = new Date(invoice.payingTime);
          console.log(payingTime.getFullYear() == this.yearToShow);
          return payingTime.getFullYear() == this.yearToShow;
        });
        this.getTotalAmount();
        console.log(this.invoices.length);
        this.invoiceList = JSON.parse(res._body);
        console.log(JSON.parse(res._body));
      }, err => {
        console.log(err);
      });
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

  searchFromDateToDate(){
    this.invoices = [];
    if (this.fromDate == ""){
      this.invoices = this.invoiceList;
      this.invoices = this.invoices.filter((invoice: Invoice) => {
          let payingTime = new Date(invoice.payingTime);
          console.log(payingTime.getFullYear() == this.yearToShow);
          return payingTime.getFullYear() == this.yearToShow;
        });
    } else {
        if (this.toDate == ""){
        let day = new Date(this.fromDate);
        let date = day.getDate();
        let month = day.getMonth();
        let year = day.getFullYear();
        for (let i = 0; i < this.invoiceList.length; i++){
          let payingTime = new Date(this.invoiceList[i].payingTime);
          if (payingTime.getDate() == date
            && payingTime.getMonth() == month
            && payingTime.getFullYear() == year){
            this.invoices.push(this.invoiceList[i]);
          }
        }
      } else {
        let day1 = new Date(this.fromDate);
        let date1 = day1.getDate();
        let month1 = day1.getMonth();
        let year1 = day1.getFullYear();
        let day2 = new Date(this.toDate);
        let date2 = day2.getDate();
        let month2 = day2.getMonth();
        let year2 = day2.getFullYear();
        for (let i = 0; i < this.invoiceList.length; i++){
          let payingTime = new Date(this.invoiceList[i].payingTime);
          if (day1 <= payingTime && payingTime <= day2){
            this.invoices.push(this.invoiceList[i]);
          }
        }
      }
    }
    this.getTotalAmount();
  }
}
