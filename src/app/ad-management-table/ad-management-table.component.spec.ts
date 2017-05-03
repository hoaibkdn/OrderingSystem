import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdManagementTableComponent } from './ad-management-table.component';

describe('AdManagementTableComponent', () => {
  let component: AdManagementTableComponent;
  let fixture: ComponentFixture<AdManagementTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdManagementTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdManagementTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
