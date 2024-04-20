import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffCommentsComponent } from './StaffCommentsComponent';

describe('StaffCommentsComponent', () => {
  let component: StaffCommentsComponent;
  let fixture: ComponentFixture<StaffCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffCommentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
