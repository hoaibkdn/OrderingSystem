import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdManagementFadComponent } from './ad-management-fad.component';

describe('AdManagementFadComponent', () => {
  let component: AdManagementFadComponent;
  let fixture: ComponentFixture<AdManagementFadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdManagementFadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdManagementFadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
