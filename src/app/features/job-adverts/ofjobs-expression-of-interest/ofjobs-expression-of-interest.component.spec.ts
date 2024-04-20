import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OFJobsExpressionOfInterestComponent } from './ofjobs-expression-of-interest.component';

describe('OFJobsExpressionOfInterestComponent', () => {
  let component: OFJobsExpressionOfInterestComponent;
  let fixture: ComponentFixture<OFJobsExpressionOfInterestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OFJobsExpressionOfInterestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OFJobsExpressionOfInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
