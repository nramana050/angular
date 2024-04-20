import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammeOutcomesListComponent } from './programme-outcomes-list.component';

describe('ProgrammeOutcomesListComponent', () => {
  let component: ProgrammeOutcomesListComponent;
  let fixture: ComponentFixture<ProgrammeOutcomesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgrammeOutcomesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgrammeOutcomesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
