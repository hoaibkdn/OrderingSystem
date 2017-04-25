import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin.component';

import { AdStatisticDrinkComponent }     from './../ad-statistic-drink/ad-statistic-drink.component';
import { StatisticComponent } from './../statistic/statistic.component';
import { CanDeactivateGuard }     from './../can-deactivate-guard.service';
import { AdManagementFadComponent } from './../ad-management-fad/ad-management-fad.component';
import { AdManagementFadtComponent } from './../ad-management-fadt/ad-management-fadt.component';
import { AdManagementStaffComponent } from './../ad-management-staff/ad-management-staff.component';
import { AdHomeComponent } from './../ad-home/ad-home.component';
import { AdStatisticServiceComponent } from './../ad-statistic-service/ad-statistic-service.component';

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
        path: 'statistic/income',
        loadChildren: 'app/ad-statistic-money/ad-statistic-money.module#AdStatisticMoneyModule'
      },
      {
        path: 'statistic/service',
        component: AdStatisticServiceComponent,
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
      },
      {
        path: 'management/staff',
        component: AdManagementStaffComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: '',
        loadChildren: 'app/ad-home/ad-home.module#AdHomeModule'
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
