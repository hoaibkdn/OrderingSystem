import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from '../admin/admin.component';

import { AdStatisticDrinkComponent }     from './../ad-statistic-drink/ad-statistic-drink.component';
import { StatisticComponent } from './../statistic/statistic.component';
import { CanDeactivateGuard }     from './../can-deactivate-guard.service';
import { AdStatisticMoneyComponent } from './../ad-statistic-money/ad-statistic-money.component';

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'detail',
        component: AdStatisticDrinkComponent,
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
