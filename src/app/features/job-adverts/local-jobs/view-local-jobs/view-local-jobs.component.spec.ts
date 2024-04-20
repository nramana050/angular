import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewNfnJobsComponent } from './view-local-jobs.component';

describe('ViewNfnJobsComponent', () => {
  let component: ViewNfnJobsComponent;
  let fixture: ComponentFixture<ViewNfnJobsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewNfnJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewNfnJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
