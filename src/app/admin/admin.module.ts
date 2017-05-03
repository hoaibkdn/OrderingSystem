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
import { DataFilterModule } from './../data-filter/data-filter.module';
import { AdManagementTableComponent } from './../ad-management-table/ad-management-table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    AdminRoutingModule,
    ChartModule,
    Ng2PaginationModule,
    DataTableModule,
    DataFilterModule
  ],
  declarations: [
    AdminComponent,
    StatisticComponent,
    AdStatisticDrinkComponent,
    AdManagementFadComponent,
    AdManagementFadtComponent,
    AdManagementStaffComponent,
    AdStatisticServiceComponent,
    AdStaffsComponent,
    AdManagementTableComponent
  ],
  providers: [
    AdStatisticDrinkService,
    AdminService
  ]
})
export class AdminModule {}
