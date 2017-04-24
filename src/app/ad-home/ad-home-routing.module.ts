import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdHomeComponent } from './ad-home.component';
import { AdOrderingComponent } from './../ad-ordering/ad-ordering.component';
import { CanDeactivateGuard } from './../can-deactivate-guard.service';
import { AdOrderingResolve } from './../ad-ordering/ad-ordering-resolve.service';
const adHomeRoutes: Routes = [
  {
    path: '',
    component: AdHomeComponent,
    children: [
      {
        path: ':id',
        component: AdOrderingComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: {
          tableId: AdOrderingResolve
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(adHomeRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AdOrderingResolve
  ]
})
export class AdHomeRoutingModule { }
