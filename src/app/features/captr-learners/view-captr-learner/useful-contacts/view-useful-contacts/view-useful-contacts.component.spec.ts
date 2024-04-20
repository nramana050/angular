import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUsefulContactsComponent } from './view-useful-contacts.component';

describe('ViewUsefulContactsComponent', () => {
  let component: ViewUsefulContactsComponent;
  let fixture: ComponentFixture<ViewUsefulContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewUsefulContactsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUsefulContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
