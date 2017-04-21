import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanQRCodeComponent } from './scan-qrcode.component';

describe('ScanQRCodeComponent', () => {
  let component: ScanQRCodeComponent;
  let fixture: ComponentFixture<ScanQRCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanQRCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanQRCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
