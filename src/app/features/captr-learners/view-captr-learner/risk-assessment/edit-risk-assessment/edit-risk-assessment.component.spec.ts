import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRiskAssessmentComponent } from './edit-risk-assessment.component';

describe('EditRiskAssessmentComponent', () => {
  let component: EditRiskAssessmentComponent;
  let fixture: ComponentFixture<EditRiskAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRiskAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRiskAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
