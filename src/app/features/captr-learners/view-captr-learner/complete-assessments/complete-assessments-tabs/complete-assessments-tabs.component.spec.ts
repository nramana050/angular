import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompleteAssessmentsTabsComponent } from './complete-assessments-tabs.component';

describe('CompleteAssessmentsTabsComponent', () => {
  let component: CompleteAssessmentsTabsComponent;
  let fixture: ComponentFixture<CompleteAssessmentsTabsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteAssessmentsTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteAssessmentsTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
