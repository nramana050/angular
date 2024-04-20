import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssessmentDocumentComponent } from './risk-assessment-document.component';

describe('RiskAssessmentDocumentComponent', () => {
  let component: RiskAssessmentDocumentComponent;
  let fixture: ComponentFixture<RiskAssessmentDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskAssessmentDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAssessmentDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
