import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsefulContactsComponent } from './useful-contacts.component';

describe('UsefulContactsComponent', () => {
  let component: UsefulContactsComponent;
  let fixture: ComponentFixture<UsefulContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsefulContactsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsefulContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
