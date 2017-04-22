import { NgModule }       from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule }   from '@angular/common';
import { AdHomeRoutingModule } from './ad-home-routing.module'

import { AdHomeComponent } from './../ad-home/ad-home.component';
import { AdOrderingComponent } from './../ad-ordering/ad-ordering.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    AdHomeRoutingModule
  ],
  declarations: [
    AdHomeComponent,
    AdOrderingComponent
  ],
  providers: []
})
export class AdHomeModule {}
