import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJobReadinessComponent } from './add-job-readiness.component';

describe('AddJobReadinessComponent', () => {
  let component: AddJobReadinessComponent;
  let fixture: ComponentFixture<AddJobReadinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddJobReadinessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddJobReadinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
