import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobReadinessHistoryComponent } from './job-readiness-history.component';

describe('JobReadinessHistoryComponent', () => {
  let component: JobReadinessHistoryComponent;
  let fixture: ComponentFixture<JobReadinessHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobReadinessHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobReadinessHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
