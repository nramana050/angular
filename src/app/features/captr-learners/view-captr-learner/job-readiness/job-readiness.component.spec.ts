import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobReadinessComponent } from './job-readiness.component';

describe('JobReadinessComponent', () => {
  let component: JobReadinessComponent;
  let fixture: ComponentFixture<JobReadinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobReadinessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobReadinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
