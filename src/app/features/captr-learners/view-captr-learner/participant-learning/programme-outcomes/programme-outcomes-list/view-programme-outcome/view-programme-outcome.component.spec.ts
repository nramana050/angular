import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProgrammeOutcomeComponent } from './view-programme-outcome.component';

describe('ViewProgrammeOutcomeComponent', () => {
  let component: ViewProgrammeOutcomeComponent;
  let fixture: ComponentFixture<ViewProgrammeOutcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProgrammeOutcomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProgrammeOutcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
