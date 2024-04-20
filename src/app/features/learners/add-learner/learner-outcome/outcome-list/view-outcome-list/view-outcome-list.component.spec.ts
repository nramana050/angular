import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOutcomeListComponent } from './view-outcome-list.component';

describe('ViewOutcomeListComponent', () => {
  let component: ViewOutcomeListComponent;
  let fixture: ComponentFixture<ViewOutcomeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewOutcomeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOutcomeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
