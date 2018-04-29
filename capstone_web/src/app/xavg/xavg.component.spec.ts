import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XavgComponent } from './xavg.component';

describe('XavgComponent', () => {
  let component: XavgComponent;
  let fixture: ComponentFixture<XavgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XavgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XavgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
