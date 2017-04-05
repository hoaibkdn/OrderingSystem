import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryInvoiceComponent } from './history-invoice.component';

describe('HistoryInvoiceComponent', () => {
  let component: HistoryInvoiceComponent;
  let fixture: ComponentFixture<HistoryInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
