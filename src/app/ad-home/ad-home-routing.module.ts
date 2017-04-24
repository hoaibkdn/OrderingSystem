import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdHomeComponent } from './ad-home.component';
import { AdOrderingComponent } from './../ad-ordering/ad-ordering.component';
import { CanDeactivateGuard }     from './../can-deactivate-guard.service';

const adHomeRoutes: Routes = [
  {
    path: '',
    component: AdHomeComponent,
    children: [
      {
        path: ':id',
        component: AdOrderingComponent,
        canDeactivate: [CanDeactivateGuard]
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
  ]
})
export class AdHomeRoutingModule { }
