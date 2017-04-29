import { NgModule }       from '@angular/core';
import { DataFilterPipe } from './data-filter.pipe';

@NgModule({
  declarations: [
    DataFilterPipe
  ],
  exports: [
    DataFilterPipe
  ]
})
export class DataFilterModule {}
