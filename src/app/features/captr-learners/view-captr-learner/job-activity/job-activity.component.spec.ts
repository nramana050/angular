import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobActivityComponent } from './job-activity.component';

describe('JobActivityComponent', () => {
  let component: JobActivityComponent;
  let fixture: ComponentFixture<JobActivityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
