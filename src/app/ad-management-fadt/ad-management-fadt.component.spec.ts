import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdManagementFadtComponent } from './ad-management-fadt.component';

describe('AdManagementFadtComponent', () => {
  let component: AdManagementFadtComponent;
  let fixture: ComponentFixture<AdManagementFadtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdManagementFadtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdManagementFadtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
