import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrisonJobsComponent } from './prison-jobs.component';

describe('PrisonJobsComponent', () => {
  let component: PrisonJobsComponent;
  let fixture: ComponentFixture<PrisonJobsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrisonJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrisonJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
