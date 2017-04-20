import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MenuComponent }      from './menu/menu.component';
import { AppComponent }  from './app.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { HistoryComponent } from './history/history.component';
import { StaffComponent } from './staff/staff.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { CanDeactivateGuard } from './can-deactivate-guard.service'

const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    pathMatch: 'full'
  },
  {
    path: 'userprofile',
    component: UserProfileComponent,
  },
  {
    path: 'history',
    loadChildren: "app/history/history.module#HistoryModule",
  },
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule'
  },
  {
    path: 'staff',
    component: StaffComponent,
  }

];

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ],
  providers: [
    CanDeactivateGuard,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ]
})
export class AppRoutingModule {}
