import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffGoalsComponent } from './staff-goals.component';

describe('StaffGoalsComponent', () => {
  let component: StaffGoalsComponent;
  let fixture: ComponentFixture<StaffGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffGoalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
