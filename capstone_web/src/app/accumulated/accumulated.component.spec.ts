import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccumulatedComponent } from './accumulated.component';

describe('AccumulatedComponent', () => {
  let component: AccumulatedComponent;
  let fixture: ComponentFixture<AccumulatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccumulatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccumulatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
