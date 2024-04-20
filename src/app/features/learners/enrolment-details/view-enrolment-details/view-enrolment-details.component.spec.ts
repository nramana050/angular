import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEnrolmentDetailsComponent } from './view-enrolment-details.component';

describe('ViewEnrolmentDetailsComponent', () => {
  let component: ViewEnrolmentDetailsComponent;
  let fixture: ComponentFixture<ViewEnrolmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEnrolmentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEnrolmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
