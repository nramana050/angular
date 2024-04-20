import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonProfessionalViewComponent } from './person-professional-view.component';

describe('PersonProfessionalViewComponent', () => {
  let component: PersonProfessionalViewComponent;
  let fixture: ComponentFixture<PersonProfessionalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonProfessionalViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonProfessionalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
