import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammeSetupComponent } from './programme-setup.component';

describe('ProgrammeSetupComponent', () => {
  let component: ProgrammeSetupComponent;
  let fixture: ComponentFixture<ProgrammeSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgrammeSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgrammeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
