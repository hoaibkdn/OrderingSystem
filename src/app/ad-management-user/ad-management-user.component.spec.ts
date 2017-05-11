import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdManagementUserComponent } from './ad-management-user.component';

describe('AdManagementUserComponent', () => {
  let component: AdManagementUserComponent;
  let fixture: ComponentFixture<AdManagementUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdManagementUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdManagementUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
