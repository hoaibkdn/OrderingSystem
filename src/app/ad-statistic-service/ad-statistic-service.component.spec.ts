import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdStatisticServiceComponent } from './ad-statistic-service.component';

describe('AdStatisticServiceComponent', () => {
  let component: AdStatisticServiceComponent;
  let fixture: ComponentFixture<AdStatisticServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdStatisticServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdStatisticServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
