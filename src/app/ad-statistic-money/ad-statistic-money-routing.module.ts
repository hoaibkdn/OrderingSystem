import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdStatisticMoneyComponent } from './../ad-statistic-money/ad-statistic-money.component';
import { AdStatisticMonthlyComponent } from './../ad-statistic-monthly/ad-statistic-monthly.component';
import { CanDeactivateGuard }     from './../can-deactivate-guard.service';
import { AdStatisticMonthlyResolve } from './../ad-statistic-monthly/ad-statistic-monthly-resolve.service';

const adStatisticMoneyRoutes: Routes = [
  {
    path: '',
    component: AdStatisticMoneyComponent,
    children: [
      {
        path: ':id',
        component: AdStatisticMonthlyComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: {
          year: AdStatisticMonthlyResolve
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(adStatisticMoneyRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AdStatisticMonthlyResolve
  ]
})
export class AdStatisticMoneyRoutes { }
