import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LocalJobsComponent } from './local-jobs.component';

describe('LocalJobsComponent', () => {
  let component: LocalJobsComponent;
  let fixture: ComponentFixture<LocalJobsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
