import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryFavoriteComponent } from './history-favorite.component';

describe('HistoryFavoriteComponent', () => {
  let component: HistoryFavoriteComponent;
  let fixture: ComponentFixture<HistoryFavoriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryFavoriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryFavoriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
