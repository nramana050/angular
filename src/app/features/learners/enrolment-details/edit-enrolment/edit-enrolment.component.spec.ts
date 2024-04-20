import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEnrolmentComponent } from './edit-enrolment.component';

describe('EditEnrolmentComponent', () => {
  let component: EditEnrolmentComponent;
  let fixture: ComponentFixture<EditEnrolmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEnrolmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEnrolmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
