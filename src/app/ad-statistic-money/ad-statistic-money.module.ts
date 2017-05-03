import { NgModule }       from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule }   from '@angular/common';
import { AdStatisticMoneyRoutes } from './ad-statistic-money-routing.module'
import { AdStatisticMoneyComponent } from './../ad-statistic-money/ad-statistic-money.component';
import { AdStatisticMonthlyComponent } from './../ad-statistic-monthly/ad-statistic-monthly.component';
import { ChartModule } from 'angular-highcharts';
import { DataTableModule } from "angular2-datatable";
import { DataFilterModule } from './../data-filter/data-filter.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    AdStatisticMoneyRoutes,
    ChartModule,
    DataFilterModule,
    DataTableModule
  ],
  declarations: [
    AdStatisticMoneyComponent,
    AdStatisticMonthlyComponent
  ],
  providers: []
})
export class AdStatisticMoneyModule {}
