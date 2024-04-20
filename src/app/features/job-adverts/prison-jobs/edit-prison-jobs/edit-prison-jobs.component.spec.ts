import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditPrisonJobsComponent } from './edit-prison-jobs.component';

describe('EditPrisonJobsComponent', () => {
  let component: EditPrisonJobsComponent;
  let fixture: ComponentFixture<EditPrisonJobsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPrisonJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPrisonJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
