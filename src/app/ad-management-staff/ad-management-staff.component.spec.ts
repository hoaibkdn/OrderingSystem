import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdManagementStaffComponent } from './ad-management-staff.component';

describe('AdManagementStaffComponent', () => {
  let component: AdManagementStaffComponent;
  let fixture: ComponentFixture<AdManagementStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdManagementStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdManagementStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
