import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolmentDetailsComponent } from './enrolment-details.component';

describe('EnrolmentDetailsComponent', () => {
  let component: EnrolmentDetailsComponent;
  let fixture: ComponentFixture<EnrolmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrolmentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
