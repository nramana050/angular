import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobAdvertsComponent } from './job-adverts.component';

describe('JobAdvertsComponent', () => {
  let component: JobAdvertsComponent;
  let fixture: ComponentFixture<JobAdvertsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobAdvertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAdvertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
