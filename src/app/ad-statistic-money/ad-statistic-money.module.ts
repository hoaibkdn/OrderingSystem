import { NgModule }       from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule }   from '@angular/common';
import { AdStatisticMoneyRoutes } from './ad-statistic-money-routing.module'
import { AdStatisticMoneyComponent } from './../ad-statistic-money/ad-statistic-money.component';
import { AdStatisticMonthlyComponent } from './../ad-statistic-monthly/ad-statistic-monthly.component';
import { ChartModule } from 'angular-highcharts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    AdStatisticMoneyRoutes,
    ChartModule
  ],
  declarations: [
    AdStatisticMoneyComponent,
    AdStatisticMonthlyComponent
  ],
  providers: []
})
export class AdStatisticMoneyModule {}
