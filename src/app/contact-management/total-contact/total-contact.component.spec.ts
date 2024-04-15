import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalContactComponent } from './total-contact.component';

describe('TotalContactComponent', () => {
  let component: TotalContactComponent;
  let fixture: ComponentFixture<TotalContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
