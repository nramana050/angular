import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditLocalJobsComponent } from './edit-local-jobs.component';

describe('EditNfnJobsComponent', () => {
  let component: EditLocalJobsComponent;
  let fixture: ComponentFixture<EditLocalJobsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLocalJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLocalJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
