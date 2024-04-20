import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemInteractionsComponent } from './system-interactions.component';

describe('SystemInteractionsComponent', () => {
  let component: SystemInteractionsComponent;
  let fixture: ComponentFixture<SystemInteractionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemInteractionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemInteractionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
