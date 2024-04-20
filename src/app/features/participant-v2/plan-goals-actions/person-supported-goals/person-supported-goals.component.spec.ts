import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonSupportedGoalsComponent } from './person-supported-goals.component';

describe('PersonSupportedGoalsComponent', () => {
  let component: PersonSupportedGoalsComponent;
  let fixture: ComponentFixture<PersonSupportedGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonSupportedGoalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonSupportedGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
