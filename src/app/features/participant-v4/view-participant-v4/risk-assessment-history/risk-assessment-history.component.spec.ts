import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssessmentHistoryComponent } from './risk-assessment-history.component';

describe('RiskAssessmentHistoryComponent', () => {
  let component: RiskAssessmentHistoryComponent;
  let fixture: ComponentFixture<RiskAssessmentHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskAssessmentHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAssessmentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
