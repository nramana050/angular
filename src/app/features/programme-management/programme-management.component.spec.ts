import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammeManagementComponent } from './programme-management.component';

describe('ProgrammeManagementComponent', () => {
  let component: ProgrammeManagementComponent;
  let fixture: ComponentFixture<ProgrammeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgrammeManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgrammeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
