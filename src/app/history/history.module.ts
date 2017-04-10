import { NgModule }       from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { CommonModule }   from '@angular/common';
import { HistoryComponent } from './history.component';
import { HistoryFavoriteComponent } from './../history-favorite/history-favorite.component';

import { HistoryRoutingModule } from './history-routing.module';
import { UserHistoryComponent } from './../user-history/user-history.component';
import { HistoryInvoiceComponent } from './../history-invoice/history-invoice.component';

import { UserHistoryService } from './../user-history/user-history.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HistoryRoutingModule
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
