import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin.component';

import { AdStatisticDrinkComponent }     from './../ad-statistic-drink/ad-statistic-drink.component';
import { StatisticComponent } from './../statistic/statistic.component';
import { CanDeactivateGuard }     from './../can-deactivate-guard.service';
import { AdStatisticMoneyComponent } from './../ad-statistic-money/ad-statistic-money.component';
import { AdManagementFadComponent } from './../ad-management-fad/ad-management-fad.component';
import { AdManagementFadtComponent } from './../ad-management-fadt/ad-management-fadt.component';


const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'statistic/food-and-drink',
        component: AdStatisticDrinkComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'statistic/money',
        component: AdStatisticMoneyComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: '',
        component: StatisticComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'management/food-and-drink',
        component: AdManagementFadComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'management/food-and-drink-type',
        component: AdManagementFadtComponent,
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
