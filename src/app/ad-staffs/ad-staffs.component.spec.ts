import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdStaffsComponent } from './ad-staffs.component';

describe('AdStaffsComponent', () => {
  let component: AdStaffsComponent;
  let fixture: ComponentFixture<AdStaffsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdStaffsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdStaffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
