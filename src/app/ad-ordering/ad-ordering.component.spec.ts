import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdOrderingComponent } from './ad-ordering.component';

describe('AdOrderingComponent', () => {
  let component: AdOrderingComponent;
  let fixture: ComponentFixture<AdOrderingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdOrderingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdOrderingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
