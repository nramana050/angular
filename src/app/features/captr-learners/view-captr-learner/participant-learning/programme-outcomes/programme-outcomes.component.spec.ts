import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammeOutcomesComponent } from './programme-outcomes.component';

describe('ProgrammeOutcomesComponent', () => {
  let component: ProgrammeOutcomesComponent;
  let fixture: ComponentFixture<ProgrammeOutcomesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgrammeOutcomesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgrammeOutcomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
