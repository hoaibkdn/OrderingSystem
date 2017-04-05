import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HistoryComponent } from './history.component';
import { HistoryInvoiceComponent } from './../history-invoice/history-invoice.component';

import { CanDeactivateGuard }     from './../can-deactivate-guard.service';
import { UserHistoryComponent } from './../user-history/user-history.component';

const userRoutes: Routes = [
  {
    path: '',
    component: HistoryComponent,
    children: [
      {
        path: 'food',
        component: UserHistoryComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'invoice',
        component: HistoryInvoiceComponent,
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(userRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class HistoryRoutingModule { }
