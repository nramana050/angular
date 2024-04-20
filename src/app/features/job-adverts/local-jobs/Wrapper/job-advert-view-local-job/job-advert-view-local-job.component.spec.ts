import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobAdvertViewNfnJobComponent } from './job-advert-view-local-job.component';

describe('JobAdvertViewNfnJobComponent', () => {
  let component: JobAdvertViewNfnJobComponent;
  let fixture: ComponentFixture<JobAdvertViewNfnJobComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobAdvertViewNfnJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAdvertViewNfnJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
