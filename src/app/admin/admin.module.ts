import { NgModule }       from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule }   from '@angular/common';
import { AdminComponent } from './admin.component';

import { AdminRoutingModule } from './admin-routing.module';
import { StatisticComponent } from './../statistic/statistic.component';
import { AdStatisticDrinkComponent } from './../ad-statistic-drink/ad-statistic-drink.component';
import { AdStatisticDrinkService } from './../ad-statistic-drink/ad-statistic-drink.service';
import { AdminService } from './../admin/admin.service';
import { AdManagementFadComponent } from './../ad-management-fad/ad-management-fad.component';
import { AdManagementFadtComponent } from './../ad-management-fadt/ad-management-fadt.component';
import { AdManagementStaffComponent } from './../ad-management-staff/ad-management-staff.component';
import { Ng2PaginationModule } from 'ng2-pagination';
import { ChartModule } from 'angular-highcharts';
import { AdStatisticServiceComponent } from './../ad-statistic-service/ad-statistic-service.component';
import { AdStaffsComponent } from './../ad-staffs/ad-staffs.component';
import { DataTableModule } from "angular2-datatable";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    AdminRoutingModule,
    ChartModule,
    Ng2PaginationModule,
    DataTableModule
  ],
  declarations: [
    AdminComponent,
    StatisticComponent,
    AdStatisticDrinkComponent,
    AdManagementFadComponent,
    AdManagementFadtComponent,
    AdManagementStaffComponent,
    AdStatisticServiceComponent,
    AdStaffsComponent
  ],
  providers: [
    AdStatisticDrinkService,
    AdminService
  ]
})
export class AdminModule {}
