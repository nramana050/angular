import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpressionsOfInterestComponent } from './expressions-of-interest.component';

describe('ExpressionsOfInterestComponent', () => {
  let component: ExpressionsOfInterestComponent;
  let fixture: ComponentFixture<ExpressionsOfInterestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpressionsOfInterestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpressionsOfInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
