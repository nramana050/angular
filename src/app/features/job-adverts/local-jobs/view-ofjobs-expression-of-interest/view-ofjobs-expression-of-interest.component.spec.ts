import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewOFJobsExpressionOfInterestComponent } from './view-ofjobs-expression-of-interest.component';

describe('ViewOFJobsExpressionOfInterestComponent', () => {
  let component: ViewOFJobsExpressionOfInterestComponent;
  let fixture: ComponentFixture<ViewOFJobsExpressionOfInterestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOFJobsExpressionOfInterestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOFJobsExpressionOfInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
