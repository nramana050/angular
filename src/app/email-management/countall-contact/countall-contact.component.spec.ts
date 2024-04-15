import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountallContactComponent } from './countall-contact.component';

describe('CountallContactComponent', () => {
  let component: CountallContactComponent;
  let fixture: ComponentFixture<CountallContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountallContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountallContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
