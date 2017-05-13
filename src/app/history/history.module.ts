import { NgModule }       from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { CommonModule }   from '@angular/common';
import { HistoryComponent } from './history.component';
import { HistoryFavoriteComponent } from './../history-favorite/history-favorite.component';

import { Ng2PaginationModule } from 'ng2-pagination';
import { HistoryRoutingModule } from './history-routing.module';
import { UserHistoryComponent } from './../user-history/user-history.component';
import { HistoryInvoiceComponent } from './../history-invoice/history-invoice.component';

import { UserHistoryService } from './../user-history/user-history.service';
import { DataTableModule } from "angular2-datatable";
import { DataFilterModule } from './../data-filter/data-filter.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HistoryRoutingModule,
    Ng2PaginationModule,
    DataTableModule,
    DataFilterModule
  ],
  declarations: [
    HistoryComponent,
    UserHistoryComponent,
    HistoryInvoiceComponent,
    HistoryFavoriteComponent
  ],
  providers: [
  ]
})
export class HistoryModule {}
