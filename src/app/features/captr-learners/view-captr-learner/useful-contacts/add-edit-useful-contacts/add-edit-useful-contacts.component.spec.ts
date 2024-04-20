import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUsefulContactsComponent } from './add-edit-useful-contacts.component';

describe('AddEditUsefulContactsComponent', () => {
  let component: AddEditUsefulContactsComponent;
  let fixture: ComponentFixture<AddEditUsefulContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditUsefulContactsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditUsefulContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
