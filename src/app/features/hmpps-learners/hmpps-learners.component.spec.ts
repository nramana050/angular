import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmppsLearnersComponent } from './hmpps-learners.component';

describe('HmppsLearnersComponent', () => {
  let component: HmppsLearnersComponent;
  let fixture: ComponentFixture<HmppsLearnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HmppsLearnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HmppsLearnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
