import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPreviousQualificationPopComponent } from './add-previous-qualification-pop.component';

describe('AddPreviousQualificationPopComponent', () => {
  let component: AddPreviousQualificationPopComponent;
  let fixture: ComponentFixture<AddPreviousQualificationPopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPreviousQualificationPopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPreviousQualificationPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
