import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOutcomeComponent } from './add-outcome.component';

describe('AddOutcomeComponent', () => {
  let component: AddOutcomeComponent;
  let fixture: ComponentFixture<AddOutcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOutcomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOutcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
