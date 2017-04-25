import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdStatisticMonthlyComponent } from './ad-statistic-monthly.component';

describe('AdStatisticMonthlyComponent', () => {
  let component: AdStatisticMonthlyComponent;
  let fixture: ComponentFixture<AdStatisticMonthlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdStatisticMonthlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdStatisticMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
